using Hangfire.Common;
using MyApp.Api.Entities.recruitment;
using MyApp.Api.Entities.site;
using MyApp.Api.Models.dto.notifications;
using MyApp.Api.Models.dto.recruitment;
using MyApp.Api.Models.dto.users;
using MyApp.Api.Repositories.recruitment;
using MyApp.Api.Repositories.users;
using MyApp.Api.Services.logs;
using MyApp.Api.Services.notifications;
using MyApp.Api.Services.users;

namespace MyApp.Api.Services.recruitment;

public interface IJobDescriptionService
{
    Task<(List<JobDescriptionDetailsDTO>, int)> GetAllPendedJobDescriptions(
        FilterRequestListDTO filters, int page, int pageSize
    );
    Task<string> AddJobDescription(JobDescriptionFormDTO data);
    Task<JobDescriptionDTO?> GetJobDescription(string requestId);
    Task<(bool, string?)> HasJobDescription(string requestId);
    Task<JobDescriptionEditDTO?> GetJobDescriptionEditById(string id);
    Task<string> UpdateJobDescription(string requestId, JobDescriptionFormDTO data);
    Task<bool> CanValidateJobDescription(string userId);
    Task ValidateJobDescription(JobDescriptionValidationDTO data);
    Task<List<JobDescriptionValidationDetailsDTO>> GetAllValidationsByRequestId(string requestId);
    Task<List<UserDto>> GetAllInterviewers(string jobId);
}


public class JobDescriptionService(IJobDescriptionRepository rep,
 IRecruitmentRequestRepository req, IRecruitmentRequestService reqSvc,
 ILogger<JobDescriptionService> log, ILogService logS,
 IJobDescriptionValidationRepository repo2, INotificationsService notif,
 IUnitOfWorkService uow, IUserRepository uRepo)
: IJobDescriptionService {
    private readonly IJobDescriptionRepository _jobDescRepo = rep;
    private readonly IRecruitmentRequestRepository _reqRepo = req;
    private readonly IRecruitmentRequestService _reqService = reqSvc;
    private readonly IJobDescriptionValidationRepository _validationRepo = repo2;
    private readonly ILogger<JobDescriptionService> _log = log;
    private readonly INotificationsService _notifService = notif;
    private readonly ILogService _logService = logS;
    private readonly IUnitOfWorkService _unitOfWork = uow;
    private readonly IUserRepository _userRepo = uRepo;


    public async Task<string> AddJobDescription(JobDescriptionFormDTO data) {
        try {
            _log.LogInformation("Création d'un TDR en cours");
            await _unitOfWork.BeginTransactionAsync();

            RecruitmentRequest request = await _reqRepo.GetRecruitmentRequestById(data.RequestId);
            if(!request.LastStatus.ToLower().Equals("validée")) 
                throw new ArgumentException("Impossible d'en créer avec une demande non validée");

            if(request.CreatorId.Equals(data.CreatorId)==false
             && request.ApplicantUserId.Equals(data.CreatorId)==false) {
                throw new ArgumentException("Seul le demandeur peut créer son TDR");
            }

            var jobWithRequest = await this.GetJobDescription(request.Id);
            if(jobWithRequest!=null) {
                _log.LogInformation(jobWithRequest.Id);
                throw new ArgumentException("Un seul TDR par demande autorisé");
            }

        // Statut "En attente" par défaut
            var defaultStatus = await _jobDescRepo.GetJobDescriptionStatusById("STF_001");
                
            var jobDescription = new JobDescription {
                Mission = data.Mission,
                RequestId = request.Id,
                Request = request,
                PostTypeId = data.PostTypeId,
                LastStatus = defaultStatus.Name
            };

            await _jobDescRepo.AddJobDescription(jobDescription);

        // Attributions
            foreach (var label in data.Attributions) {
                await _jobDescRepo.AddJobAttribution(new Attribution
                {
                    JobDescriptionId = jobDescription.Id,
                    Label = label
                });
            }

        // Formations
            foreach (var formation in data.Formations) {
                await _jobDescRepo.AddFormation(new Formation 
                {
                    JobDescriptionId = jobDescription.Id,
                    Formations = formation,
                });
            }

        // Expériences
            foreach (var dto in data.Experiences) {
                await _jobDescRepo.AddExperience(new Experience
                {
                    JobDescriptionId = jobDescription.Id,
                    ExperiencePost = dto.Post,
                    ExperienceYears = dto.Years
                });
            }

        // Soft skills
            foreach (var label in data.SoftSkills) {
                await _jobDescRepo.AddJobDescriptionSoftSkill(new JobDescriptionSoftSkill 
                {
                    JobDescriptionId = jobDescription.Id,
                    SoftSkill = label
                });
            }

        // Skills
            foreach (var skill in data.Skills) {
                await _jobDescRepo.AddSkill(new Skill
                {
                    JobDescriptionId = jobDescription.Id,
                    Label = skill
                });
            }

        // Validation du TDR
            var validation = new JobDescriptionValidation {
                ValidatorId = data.CreatorId,
                StatusId = "STF_001",
                JobDescriptionId = jobDescription.Id
            };
            await _jobDescRepo.AddValidation(validation);

        // Envoi de notification au validateur de TDR
            var validators = await _validationRepo.GetAllJobDescriptionValidators();
            List<string> validatorsIds = validators.Select(v => v.UserId).ToList();
        
        // COMMIT
            await _unitOfWork.CommitAsync();

            var notification = new NotificationFormDTO {
                Title = $"Un nouveau TDR a été créé",
                Message = $"Le TDR au poste de \"{jobDescription.Request.Post}\" est en attente de validation.",
                Type = "recruitment",
                RelatedTable = "TDRs",
                RelatedMenu = "collaborateur",
                RelatedId = jobDescription.Id,
                Priority = 2,
                UserIds = validatorsIds,
                CreatedAt = DateTime.UtcNow
            };
            await _notifService.CreateAsync(notification, null);

        // LOG
            await _logService.LogAsync("INSERTION TDR", "termes_reference",
             request.Creator.UserId);

            return jobDescription.Id;
        }
        catch (Exception ex) {
            // await _unitOfWork.RollbackAsync();
            _log.LogError(ex, "Erreur de création d'un TDR");
            throw;
        }
    }
    

    public async Task<JobDescriptionDTO?> GetJobDescription(string requestId) {
        try
        {
            _log.LogInformation("Recherche de TDR en cours");
            JobDescriptionDTO result = new();

            RecruitmentRequest request = await _reqRepo.GetRecruitmentRequestById(requestId);
            List<Site> sites = await _reqRepo.GetSitesAsync(request);
            JobDescription? jobDesc = await _jobDescRepo.GetJobDescriptionByRequest(request);

            if (jobDesc == null) return null;

            // Infos générales
            result.RequestId = requestId;
            result.Post = request.Post;
            result.LastTitular = request.LastTitular?.Name;
            result.Id = jobDesc.Id;
            result.Mission = jobDesc.Mission;
            result.CreatedAt = jobDesc.CreatedAt;
            result.LastStatus = jobDesc.LastStatus;
            result.PostTypeName = jobDesc.PostType.Name;

            // Attributions
            result.Attributions = jobDesc.Attributions.Select(a => a.Label).ToArray();

            // Formations et Expériences
            result.Formations = jobDesc.Formations.Select(f => $"{f.Formations}").ToArray();
            result.Experiences = jobDesc.Experiences.Select(e =>
            {
                string yearsLabel = e.ExperienceYears > 1 ? "ans" : "an";
                return $"{e.ExperiencePost} (Minimum {e.ExperienceYears} {yearsLabel})";
            }).ToArray();

            // SoftSkills
            result.SoftSkills = jobDesc.SoftSkills.Select(s => s.SoftSkill).ToArray();

            // Skills
            result.Skills = jobDesc.Skills.Select(s => s.Label).ToArray();

            // Criterias
            var criteria = jobDesc.Criteria;
            decimal totalScore = 0m;
            if (criteria != null && criteria.Any())
            {
                var dto = new JobCriteriaDTO
                {
                    LevelEducations = new List<LevelEducationDataDTO>(),
                    Experiences = new List<ExperienceDataDTO>(),
                    Langages = new List<LangageDataDTO>()
                };

                foreach (var c in criteria)
                {
                    switch (c.PreselectionCriteriaId)
                    {
                        case "CRIT_001": // Education
                            totalScore+=c.MaxPoints;
                            dto.LevelEducationsPoints = c.MaxPoints;
                            dto.LevelEducations = c.LevelEducations
                                .Select(le => new LevelEducationDataDTO
                                {
                                    LevelId = le.LevelEducationId,
                                    LevelName = le.LevelEducation.Name,
                                    Points = le.Points
                                }).ToList();
                            break;

                        case "CRIT_002": // Formation
                            totalScore+=c.MaxPoints;
                            dto.FormationsPoints = c.MaxPoints;
                            break;

                        case "CRIT_005": // Présentation
                            totalScore+=c.MaxPoints;
                            dto.PresentationsPoints = c.MaxPoints;
                            break;

                        case "CRIT_003": // Expérience
                            totalScore+=c.MaxPoints;
                            dto.ExperiencesPoints = c.MaxPoints;
                            dto.Experiences = c.Experiences
                                .Select(e => new ExperienceDataDTO
                                {
                                    MinYear = e.MinYear,
                                    MaxYear = e.MaxYear,
                                    Points = e.Points
                                }).ToList();
                            break;

                        case "CRIT_004": // Langues
                            totalScore+=c.MaxPoints;
                            dto.LangagesPoints = c.MaxPoints;
                            dto.Langages = c.Speakings
                                .Select(s => new LangageDataDTO
                                {
                                    LangageId = s.LangageSpeaking.Langage.Id,
                                    Langage = s.LangageSpeaking.Langage.Name,
                                    LevelId = s.LangageSpeaking.SpeakingLevel.Id,
                                    Level = s.LangageSpeaking.SpeakingLevel.Name,
                                    Points = s.Points
                                }).ToList();
                            break;
                    }
                }
                dto.TotalScore = totalScore;
                dto.Status = criteria.First().ValidatedAt != null ? "Validée" : "Brouillon";
                result.Criteria = dto;
            }

            return result;
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "Erreur de recherche de TDR");
            throw;
        }
    }


    public async Task<(bool, string?)> HasJobDescription(string requestId) {
        _log.LogInformation("Vérification de l'éxistence en cours");
        var jobDesc = await this.GetJobDescription(requestId);

        return (jobDesc != null, jobDesc?.Id);
    }


    public async Task<string> UpdateJobDescription(string requestId, JobDescriptionFormDTO data) {
        try {
            _log.LogInformation("Mise à jour du TDR en cours");
            await _unitOfWork.BeginTransactionAsync();

            RecruitmentRequest request = await _reqRepo.GetRecruitmentRequestById(requestId);
            JobDescription? lastJobDesc = await _jobDescRepo.GetJobDescriptionByRequest(request);

            if(lastJobDesc == null) throw new ArgumentException("Aucun TDR à mettre à jour");
            
            if(request.CreatorId.Equals(data.CreatorId)==false
             && request.ApplicantUserId.Equals(data.CreatorId)==false) {
                throw new ArgumentException("Seul le demandeur peut modifier son TDR");
            }

            lastJobDesc.Mission = data.Mission;
            lastJobDesc.RequestId = requestId; // safe
            lastJobDesc.PostTypeId = data.PostTypeId;

        // =========================
        // Nettoyage des collections
        // =========================
            _jobDescRepo.RemoveAttributions(lastJobDesc.Attributions);
            _jobDescRepo.RemoveFormations(lastJobDesc.Formations);
            _jobDescRepo.RemoveExperiences(lastJobDesc.Experiences);
            _jobDescRepo.RemoveSoftSkills(lastJobDesc.SoftSkills);
            _jobDescRepo.RemoveSkills(lastJobDesc.Skills);

        // =========================
        // Réinsertion
        // =========================
            // Attributions
            foreach (var label in data.Attributions) {
                await _jobDescRepo.AddJobAttribution(new Attribution
                {
                    JobDescriptionId = lastJobDesc.Id,
                    Label = label
                });
            }

            // Formations
            foreach (var formation in data.Formations) {
                await _jobDescRepo.AddFormation(new Formation
                {
                    JobDescriptionId = lastJobDesc.Id,
                    Formations = formation,
                });
            }

            // Expériences
            foreach (var dto in data.Experiences) {
                await _jobDescRepo.AddExperience(new Experience
                {
                    JobDescriptionId = lastJobDesc.Id,
                    ExperiencePost = dto.Post,
                    ExperienceYears = dto.Years
                });
            }

            // Soft skills
            foreach (var label in data.SoftSkills) {
                await _jobDescRepo.AddJobDescriptionSoftSkill(new JobDescriptionSoftSkill
                {
                    JobDescriptionId = lastJobDesc.Id,
                    SoftSkill = label
                });
            }

            // Skills
            foreach (var skill in data.Skills) {
                await _jobDescRepo.AddSkill(new Skill
                {
                    JobDescriptionId = lastJobDesc.Id,
                    Label = skill
                });
            }

            // Commit
            await _unitOfWork.CommitAsync();

            // LOG
            await _logService.LogAsync("MODIFICATION TDR", "termes_reference",
             request.Creator.UserId);

            return lastJobDesc.Id;
        }
        catch (Exception ex) {
            // await _unitOfWork.RollbackAsync();
            _log.LogError(ex, "Erreur de mise à jour de TDR");
            throw;
        }
    }
    

    public async Task<JobDescriptionEditDTO?> GetJobDescriptionEditById(string id) {
        try {
            _log.LogInformation("Recherche de TDR par ID en cours");

            JobDescription jobDesc = await _jobDescRepo.GetJobDescriptionById(id);

            if(jobDesc == null) return null;

            var result = new JobDescriptionEditDTO
            {
                Id = jobDesc.Id,
                RequestId = jobDesc.RequestId,
                PostTypeId = jobDesc.PostTypeId,
                Mission = jobDesc.Mission,
                Attributions = jobDesc.Attributions.Select(a => a.Label).ToArray(),
                Formations = jobDesc.Formations.Select(f => f.Formations).ToArray(),
                SoftSkills = jobDesc.SoftSkills.Select(s => s.SoftSkill).ToArray(),
                Skills = jobDesc.Skills.Select(s => s.Label).ToArray(),
                Experiences = jobDesc.Experiences.Select(e => new ExperienceDTO 
                {
                    Post = e.ExperiencePost,
                    Years = e.ExperienceYears
                }).ToArray()
            };

            return result;
        }
        catch (Exception ex) {
            _log.LogError(ex, "Erreur de recherche de TDR par ID");
            throw;
        }
    }


    public async Task<(List<JobDescriptionDetailsDTO>, int)> GetAllPendedJobDescriptions(
        FilterRequestListDTO filters, int page, int pageSize
    ) {
        try {
            _log.LogInformation("Récupération des TDR en attente de validation ...");

            return await _jobDescRepo.GetAllPendedJobDescriptions(
                filters, page, pageSize);
        }
        catch(Exception ex) {
            _log.LogError(ex, "Erreur lors de la récupération des TDR en attente de validation");
            throw;
        }
    }


    public async Task ValidateJobDescription(JobDescriptionValidationDTO data) {
        try {
            _log.LogInformation("En cours de faire la validation ...");
            var jobDesc = await _validationRepo.ValidateJobDescription(data);

        // Tous les validateurs
            List<UserDto> validators = await _validationRepo.GetAllJobDescriptionValidators();
            List<string> validatorsIds = validators.Select(u=>u.UserId).ToList();

        // Envoi de notification au créateur
            if(validators!=null) {
                var notification = new NotificationFormDTO
                {
                    Title = $"Votre TDR a été validée",
                    Message = $"Le TDR au poste de \"{jobDesc.Request.Post}\" est validé par {validators[0].Name}.",
                    Type = "recruitment",
                    RelatedTable = "TDRs",
                    RelatedMenu = "collaborateur",
                    RelatedId = jobDesc.Id,
                    Priority = 2,
                    UserIds = [jobDesc.Request.ApplicantUser.UserId],
                    CreatedAt = DateTime.UtcNow
                };

            // Envoi de notification
                await _notifService.CreateAsync(notification, null);
            }
        }
        catch(Exception ex) {
            _log.LogError(ex, "Erreur lors de la validation");
            throw;
        }
    }


    public async Task<bool> CanValidateJobDescription(string userId) {
        List<UserDto> validators = await _validationRepo.GetAllJobDescriptionValidators();
        
        for(int i=0; i<validators.Count; i++) {
            bool isValidator = validators.Any(v => v.UserId==userId);

            if(isValidator==true) return true;
        }
        return false;
    }


    public async Task<List<JobDescriptionValidationDetailsDTO>> GetAllValidationsByRequestId(string requestId) {
        try {
            _log.LogInformation("Récupération des validations de TDR ...");
            return await _validationRepo.GetAllValidationsByRequestId(requestId);
        }
        catch(Exception ex) {
            _log.LogError(ex, "Erreur lors de la récupération des validations de TDR");
            throw;
        }
    }


    public async Task<List<UserDto>> GetAllInterviewers(string jobId) {
        try {
            _log.LogInformation("Recherche des collaborateurs qui feront les entretiens en cours");
            JobDescription jobDesc = await _jobDescRepo.GetJobDescriptionById(jobId);

        // Vérifier le type de poste : TYP_POS-0001 ou TYP_POS-0002
            PostType postType = jobDesc.PostType;

            List<UserDto> interviewers = [];

            RecruitmentRequest req = await _reqRepo.GetRecruitmentRequestById(jobDesc.RequestId);
            var requestValidations = await _reqService.GetValidationsByRequestId(req.Id);
        
        // 1 - Responsable recrutement (obligatoire)
            var validators = await _validationRepo.GetAllJobDescriptionValidators();
            var recruitmentAdm = validators.FirstOrDefault(v => v.Department=="DRH"
             && v.Matricule!.ToLower().StartsWith("st")==false)
             ?? throw new ArgumentException("Responsable de recrutement non trouvé");

            interviewers.Add(recruitmentAdm);

        // 2 - Futur supérieur (obligatoire)
            var requestor = await _userRepo.GetByIdAsync(req.HierarchicalManagerId)
            ?? throw new ArgumentException("Supérieur non trouvé");

            if (interviewers.Select(i => i.UserId).Contains(requestor.UserId)==false) {
                interviewers.Add(UserService.MapToDto(requestor));
            }

        // 3 - Directeur tutelle (obligatoire)
            var supDirector = await _userRepo.GetDirectorByDepartmentAsync(requestor.Department!)
            ?? throw new ArgumentException("Directeur de tutelle non trouvé");

            if (interviewers.Select(i => i.UserId).Contains(supDirector.UserId)==false) {
                interviewers.Add(UserService.MapToDto(supDirector));
            }

            if (postType.Id == "TYP_POS-0001") {
            // 4 - DRH -> 3e dernier validateur (TYP_POS-0001 seulement)
                var drh = await _userRepo.GetDrhAsync()
                ?? throw new ArgumentException("DRH non trouvé(e)");

                if (interviewers.Select(i => i.UserId).Contains(drh.UserId)==false) {
                    interviewers.Add(UserService.MapToDto(drh));
                }

            // 5 - DG -> Dernier validateur (TYP_POS-0001 seulement)
                var dg = await _userRepo.GetGeneralDirector()
                ?? throw new ArgumentException("DG non trouvé(e)");

                if (interviewers.Select(i => i.UserId).Contains(dg.UserId)==false) {
                    interviewers.Add(UserService.MapToDto(dg));
                }
            }
            
            return interviewers;
        }
        catch (Exception ex) {
            _log.LogError(ex, "Erreur lors de la recherche");
            throw;
        }
    }
}
