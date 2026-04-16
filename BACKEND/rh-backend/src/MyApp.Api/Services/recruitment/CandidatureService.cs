using MyApp.Api.Entities.recruitment;
using MyApp.Api.Models.dto.recruitment;
using MyApp.Api.Repositories.recruitment;

namespace MyApp.Api.Services.recruitment;

public interface ICandidatureService
{
    Task<(IEnumerable<CandidatureDTO>, CandidaturesDetailsDTO)> GetByJobDescriptionIdAsync(
     string jobDescId, CandidatureFiltersDTO filters, int page, int pageSize);
    Task AddCandidature(string jobId, CandidatureFormDTO data);
    Task FinishCandidatureTreatment(string candidatureId);
    Task UpdateCriteriaPoints(string candidatureId, string criteriaId, decimal newPoints);
    Task<CandidatureDetailsDTO> GetCandidatureDetailsAsync(string id);
    
    Task AddCandidatureComment(string cadId, CandidatureCommentFormDTO data);
    Task UpdateCandidatureComment(string cadId, CandidatureCommentFormDTO data);
    Task DeleteCandidatureComment(string cadId);
    Task<PaginatedResult<CandidatureComment>> GetPaginatedCommentsAsync(string id, int page, int pageSize);
}

public class CandidatureService(ICandidatureRepository rep,
 IJobDescriptionRepository jobDescRep, IUnitOfWorkService unitService,
 ILogger<CandidatureService> logger,
 IPreselectionService preselectService) : ICandidatureService
{
    private readonly IUnitOfWorkService _dbService = unitService;
    private readonly ICandidatureRepository _repo = rep;
    private readonly IPreselectionService _preselectService = preselectService;
    private readonly IJobDescriptionRepository _jobDescRepo = jobDescRep;
    private readonly ILogger<CandidatureService> _logger = logger;


    public async Task<(IEnumerable<CandidatureDTO>, CandidaturesDetailsDTO)> GetByJobDescriptionIdAsync(
        string jobDescId, CandidatureFiltersDTO filters, int page, int pageSize)
    {
    // 1. Charger candidatures avec leurs scores
        var candidaturesEntity = await _repo.GetByJobDescriptionIdAsync(jobDescId, filters, page, pageSize);

    // 2. Charger les critères du job avec MaxPoints
        var jobDesc = await _jobDescRepo.GetJobDescriptionById(jobDescId);
        var criteria = jobDesc.Criteria ?? new List<JobDescriptionCriteria>();
        decimal maxScore = criteria.Sum(c => c.MaxPoints);

    // 3. Construire les DTOs candidats
        var candidaturesDTO = candidaturesEntity.Select(c => new CandidatureDTO
        {
            Id = c.Id,
            FirstName = c.FirstName,
            LastName = c.LastName,
            Email = c.EmailContact,
            LmUrl = c.LmUrl ?? "N/A",
            CvUrl = c.CvUrl ?? "N/A",
            SendingDateTime = c.CreatedAt,
            IsTreated = c.IsTreated,
            IsPreselected = c.IsPreselected,
            TotalScore = c.CandidatureScores?.Sum(s => s.Points) ?? 0,
            MaxScore = maxScore
        }).ToList();

    // 4. Filtrage si nécessaire
        if (filters.IsPreselected != null) {
            candidaturesDTO = candidaturesDTO
                .Where(c => c.IsPreselected == true && c.IsTreated == true)
                .OrderByDescending(c => c.TotalScore)
                .ToList();
        }
        else {
            candidaturesDTO = candidaturesDTO
                .OrderByDescending(c => c.SendingDateTime)
                .ToList();
        }

    // 5. Préparer les détails du job
        var detailsDTO = new CandidaturesDetailsDTO
        {
            Contract = jobDesc.Request.Contract?.Code ?? jobDesc.Request.ContractPrecision ?? "N/A",
            Direction = jobDesc.Request.HierarchicalManager.Department ?? "N/A",
            Post = jobDesc.Request.Post ?? "N/A",
        };

        return (candidaturesDTO, detailsDTO);
    }


    public async Task<CandidatureDetailsDTO> GetCandidatureDetailsAsync(string id) {
        try {
            _logger.LogInformation("Récupération des détails de la candidature {Id}", id);

        // 1. Charger la candidature et ses détails
            var details = await _repo.GetCandidatureDetails(id);
            var candidature = await _repo.GetCandidatureById(id);

            if (details == null || candidature == null) {
                _logger.LogWarning("Candidature non trouvée pour l'ID {Id}", id);
                throw new InvalidOperationException("Candidature non trouvée");
            }

        // 2. Charger tous les critères de pré-sélection
            var criteriaList = await _preselectService.GetAllPreselectionCriteriaAsync();
            var criteriaDict = criteriaList.ToDictionary(c => c.Id, c => c.Criteria);

        // 3. Ajouter les scores au DTO avec nom du critère
            details.Scores = candidature.CandidatureScores
                .Select(s => new CandidatureScoreDTO
                {
                    Id = s.Id,
                    CriteriaId = s.Criteria.PreselectionCriteriaId, // l'ID du PreselectionCriteria
                    Criteria = s.Criteria.PreselectionCriteria.Criteria,
                    Points = s.Points,
                    Max = s.Criteria.MaxPoints
                }).ToList();

        // 4. Calculer le total des points obtenus par le candidat
            details.TotalScore = details.Scores?.Sum(s => s.Points) ?? 0;
            details.MaxScore = details.Scores?.Sum(s => s.Max) ?? 0;

            return details;
        }
        catch (Exception ex) {
            _logger.LogError(ex, "Erreur lors de la récupération des détails de la candidature {Id}", id);
            throw;
        }
    }

    private decimal CalculateEducationScore(
        string levelEducationId, JobDescriptionCriteria criteria
    ) {
        var match = criteria.LevelEducations
            .FirstOrDefault(le => le.LevelEducationId == levelEducationId);

        return match?.Points ?? 0;
    }

    private decimal CalculateExperienceScore(
        int yearsOfExperience, JobDescriptionCriteria criteria
    ) {
        var match = criteria.Experiences
            .FirstOrDefault(exp =>
                yearsOfExperience >= exp.MinYear &&
                yearsOfExperience <= exp.MaxYear
            );

        return match?.Points ?? 0;
    }

    private int GetLevelRank(string code) {
        return code switch {
            "A1" => 1,
            "A2" => 2,
            "B1" => 3,
            "B2" => 4,
            "C1" => 5,
            "C2" => 6,
            _ => 0
        };
    }

    private decimal CalculateLanguageScore(
        ICollection<CandidatureLangage> candidateLangs, JobDescriptionCriteria criteria
    ) {
        decimal totalPoints = 0;

        foreach (var required in criteria.Speakings)
        {
            var requiredLangId = required.LangageSpeaking?.LangageId;
            var requiredLevel = required.LangageSpeaking?.SpeakingLevel?.Code;

            var candidateLang = candidateLangs
                .FirstOrDefault(cl =>
                    cl.LangageSpeaking?.LangageId == requiredLangId
                );

            if (candidateLang == null) {
                continue;
            }
            var candidateLevel = candidateLang.LangageSpeaking?.SpeakingLevel?.Code;

            if (candidateLevel == null || requiredLevel == null) {
                _logger.LogWarning("Niveau NULL détecté");
                continue;
            }

            var candidateRank = GetLevelRank(candidateLevel);
            var requiredRank = GetLevelRank(requiredLevel);

            if (requiredRank == 0) {
                continue;
            }

        // Si niveau >= requis -> 100% des points, sinon calcul du ratio
            decimal ratio = candidateRank >= requiredRank ?
                1m : (decimal)candidateRank / requiredRank;

            var gainedPoints = ratio * required.Points;

        // Incrémentation du point gagné
            totalPoints += gainedPoints;
        }

        return totalPoints;
    }


    private async Task AssignCandidatureScoresAsync(Candidature candidature) {
        try {
            _logger.LogInformation("Définition automatique des points de la candidature {id}", candidature.Id);

            var job = await _jobDescRepo.GetByIdWithCriteria(candidature.JobDescriptionId)
             ?? throw new ArgumentException("TDR non trouvé");
            _logger.LogInformation("Nombre de critères: {count}", job.Criteria.Count);

            var detail = candidature.CandidatureDetails.FirstOrDefault();
            if (detail == null) return;

            _logger.LogInformation("Nombre de langues candidat: {count}", 
    detail.CandidatureLangages.Count);

            foreach (var crit in job.Criteria) {
                switch (crit.PreselectionCriteriaId) 
                {
                    case "CRIT_001": // Niveau d'étude
                        var educationScore = CalculateEducationScore(
                            detail.LevelEducationId, crit
                        );
                        await _repo.AddCandidatureScoreAsync(new CandidatureScore {
                            CandidatureId = candidature.Id,
                            CriteriaId = crit.Id,
                            Points = educationScore
                        });
                        break;

                    case "CRIT_003": // Expérience
                        var experienceScore = CalculateExperienceScore(
                            detail.YearsOfExperience, crit
                        );
                        await _repo.AddCandidatureScoreAsync(new CandidatureScore {
                            CandidatureId = candidature.Id,
                            CriteriaId = crit.Id,
                            Points = experienceScore
                        });
                        break;
                    
                    case "CRIT_004": // Compétences linguistiques
                        var langScore = CalculateLanguageScore(
                            detail.CandidatureLangages.ToList(), crit
                        );
                        await _repo.AddCandidatureScoreAsync(new CandidatureScore {
                            CandidatureId = candidature.Id,
                            CriteriaId = crit.Id,
                            Points = langScore
                        });
                        break;

                    case "CRIT_002": // Formation (manuel)
                        await _repo.AddCandidatureScoreAsync(new CandidatureScore {
                            CandidatureId = candidature.Id,
                            CriteriaId = crit.Id,
                            Points = 0m
                        });
                        break;

                    case "CRIT_005": // Clarté CV (manuel)
                        await _repo.AddCandidatureScoreAsync(new CandidatureScore {
                            CandidatureId = candidature.Id,
                            CriteriaId = crit.Id,
                            Points = 0m
                        });
                        break;

                    default:
                        _logger.LogWarning("Critère inconnu : {critId}", crit.PreselectionCriteriaId);
                        break;
                }
            }
        }
        catch (Exception ex) {
            _logger.LogError(ex, "Erreur lors de la définition des points");
            throw;
        }
    }


    public async Task AddCandidature(string jobId, CandidatureFormDTO data) {
        try {
            _logger.LogInformation("Insertion de la nouvelle candidature de : {email}...", data.Email);
            
            var jobCriteria = await _jobDescRepo.GetByIdWithCriteria(jobId);

            if (jobCriteria?.Criteria == null || !jobCriteria.Criteria.Any() || 
             jobCriteria.Criteria.Any(c => c.ValidatedAt == null)) {
                throw new ArgumentException("Les critères du poste ne sont pas encore validés.");
            }

            await _dbService.BeginTransactionAsync();

        // Infos générales
            Candidature newCandidature = new() {
                FirstName = data.FirstName,
                LastName = data.LastName.ToUpper(),
                EmailContact = data.Email,
                CvUrl = data.CvUrl, 
                LmUrl = data.LmUrl,
                CreatedAt = DateTime.UtcNow,
                JobDescriptionId = jobId
            };
            var jobDesc = await _jobDescRepo.GetJobDescriptionById(jobId);
            await _repo.AddAsync(newCandidature, jobDesc.Request.HierarchicalManager.Department!);

        // Niv. d'étude et année d'exp.
            CandidatureDetail detail = new() {
                CandidatureId = newCandidature.Id,
                LevelEducationId = data.LevelEducationId,
                YearsOfExperience = data.YearsOfExperience,
            };
            await _repo.AddCandidatureDetailAsync(detail);
            newCandidature.CandidatureDetails.Add(detail);

        // Compétences linguistiques
            foreach (var lang in data.Langages) {
                var langageSpeaking = await _repo.GetLangageSpeakingByIdsAsync(lang.LangageId, lang.LevelId);

                if (langageSpeaking == null) {
                    _logger.LogWarning("Langue ou niveau non trouvé pour LangageId: {LangageId}, LevelId: {LevelId}",
                     lang.LangageId, lang.LevelId);
                    continue; // Ignorer cette compétence linguistique
                }

                CandidatureLangage langage = new() {
                    CandidatureDetailId = detail.Id,
                    LangageSpeakingId = langageSpeaking.Id,
                };
                await _repo.AddCandidatureLangageAsync(langage);
                detail.CandidatureLangages.Add(langage);
            }

        // Formations
            foreach(var formation in data.Formations) {
                CandidatureFormation entityFormation = new() {
                    CandidatureId = newCandidature.Id,
                    Formation = formation
                };
                await _repo.AddCandidatureFormationAsync(entityFormation);
            }

        // Insertion des notes
            await this.AssignCandidatureScoresAsync(newCandidature);

            await _dbService.CommitAsync();
        } 
        catch (Exception ex) {
            _logger.LogError(ex, "Erreur lors de l'insertion de la candidature");

            await _dbService.RollbackAsync();
            throw;
        }
    }


    public async Task UpdateCriteriaPoints(string candidatureId,
     string criteriaId, decimal newPoints) {
        try {
            _logger.LogInformation("Mise à jour du note de la candidature {candidatureId}"
            , candidatureId);

            await _repo.UpdateCriteriaPoints(candidatureId, criteriaId, newPoints);
        } 
        catch (Exception ex) {
            _logger.LogError(ex, "Erreur lors de la mise à jour du note");
            throw;
        }
    }


    public async Task FinishCandidatureTreatment(string candidatureId) {
        try {
            _logger.LogInformation("Validation de fin de traitement de la candidature {candidatureId}"
            , candidatureId);

            await _repo.FinishCandidatureTreatment(candidatureId);
        } 
        catch (Exception ex) {
            _logger.LogError(ex, "Erreur lors de la Validation de fin de traitement");
            throw;
        }
    }


    public async Task AddCandidatureComment(string canId, CandidatureCommentFormDTO data) {
        await _dbService.BeginTransactionAsync();
        try {
            var comment = new CandidatureComment {
                CandidatureId = canId,
                Comment = data.Comment,
                UserId = data.CommentatorId,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            };

            await _repo.AddCandidatureCommentAsync(comment);

            await _dbService.CommitAsync();
        }
        catch {
            await _dbService.RollbackAsync();
            throw;
        }
    }


    public async Task UpdateCandidatureComment(string id, CandidatureCommentFormDTO data) {
        await _dbService.BeginTransactionAsync();
        try {
            var comment = await _repo.GetByCommentIdAsync(id);

            if (comment == null)
                throw new Exception("Commentaire introuvable");

            if (comment.UserId != data.CommentatorId) {
                throw new ArgumentException("Impossible de modifier les commentaires des autres");
            }

            comment.Comment = data.Comment;
            comment.UpdatedAt = DateTime.UtcNow;

            await _dbService.CommitAsync();
        }
        catch {
            await _dbService.RollbackAsync();
            throw;
        }
    }

    public async Task DeleteCandidatureComment(string commId) {
        await _dbService.BeginTransactionAsync();
        try {
            await _repo.SoftDeleteCommentAsync(commId);

            await _dbService.CommitAsync();
        }
        catch {
            await _dbService.RollbackAsync();
            throw;
        }
    }

    public async Task<PaginatedResult<CandidatureComment>> GetPaginatedCommentsAsync(
        string id, int page, int pageSize
    ) {
        return await _repo.GetPaginatedAsync(id, page, pageSize);
    }
}
