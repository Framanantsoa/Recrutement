using MyApp.Api.Entities.recruitment;
using MyApp.Api.Models.dto.recruitment;
using MyApp.Api.Repositories.recruitment;

namespace MyApp.Api.Services.recruitment;

public interface IPreselectionService
{
    Task<List<Langage>> GetAllLangagesAsync();
    Task<List<PreselectionCriteria>> GetAllPreselectionCriteriaAsync();
    Task<List<SpeakingLevel>> GetAllSpeakingLevelsAsync();
    Task AddJobPreselectionCriteria(JobCriteriaFormDTO data);
    Task<string> ConfirmCriteria(string jobId);
    Task<JobCriteriaDTO> UpdateJobPreselectionCriteria(string jobId, JobCriteriaFormDTO data);
}


public class PreselectionService(
    IPreselectionRepository r1, ILogger<PreselectionService> log,
    IJobDescriptionRepository r2, IUnitOfWorkService db
) : IPreselectionService
{
    private readonly ILogger<PreselectionService> _logger = log;
    private readonly IPreselectionRepository _repo = r1;
    private readonly IJobDescriptionRepository _jobRepo = r2;
    private readonly IUnitOfWorkService _dbService = db;


    public async Task<List<Langage>> GetAllLangagesAsync() {
        try {
            _logger.LogInformation("Recherche des langues en cours ...");
            return await _repo.GetAllLangagesAsync();
        }
        catch(Exception ex) {
            _logger.LogError(ex, "Erreur lors de la recherche des langues");
            throw;
        }
    }


    public async Task<List<PreselectionCriteria>> GetAllPreselectionCriteriaAsync() {
        try {
            _logger.LogInformation("Recherche des critères en cours ...");
            return await _repo.GetAllPreselectionCriteriaAsync();
        }
        catch(Exception ex) {
            _logger.LogError(ex, "Erreur lors de la recherche des critères");
            throw;
        }
    }


    public async Task<List<SpeakingLevel>> GetAllSpeakingLevelsAsync() {
        try {
            _logger.LogInformation("Recherche des niveaux de langue en cours ...");
            return await _repo.GetAllSpeakingLevelsAsync();
        }
        catch(Exception ex) {
            _logger.LogError(ex, "Erreur lors de la recherche des niveaux de langue");
            throw;
        }
    }

    public async Task AddJobPreselectionCriteria(JobCriteriaFormDTO data) {
        await _dbService.BeginTransactionAsync();

        try {
            _logger.LogInformation("Insertion des critères de présélection...");

            var job = await _jobRepo.GetByIdWithCriteria(data.JobDescId)
             ?? throw new ArgumentException("TDR introuvable");

            if (job.Criteria != null && job.Criteria.Any())
                throw new InvalidOperationException("Ce TDR possède déjà des critères");

        // ================= VALIDATION LANGUES =================
            var langageIds = data.Langages.Select(l => l.LangageId).ToList();
            var levelIds = data.Langages.Select(l => l.LevelId).ToList();

            var speakingLangages = await _repo.GetLangageSpeakings(langageIds, levelIds);

            var dict = speakingLangages.ToDictionary(
                s => (s.LangageId, s.SpeakingLevelId),
                s => s
            );

            if (data.Langages.Any(l => !dict.ContainsKey((l.LangageId, l.LevelId))))
                throw new ArgumentException("Certaines langues/niveaux sont invalides");

        // ================= NIVEAU D'ETUDE =================
            var educationCriteria = new JobDescriptionCriteria
            {
                JobDescriptionId = data.JobDescId,
                PreselectionCriteriaId = "CRIT_001",
                MaxPoints = data.LevelEducationsPoints,
                CreatedAt = DateTime.UtcNow
            };
            await _repo.AddJobPreselectionCriteria(educationCriteria);

            foreach (var l in data.LevelEducation)
            {
                await _repo.AddLevelEducation(new JobCriteriaLevelEducation
                {
                    JobCriteriaId = educationCriteria.Id,
                    LevelEducationId = l.LevelId,
                    Points = l.Points
                });
            }

        // ================= FORMATION =================
            var formationCriteria = new JobDescriptionCriteria
            {
                JobDescriptionId = data.JobDescId,
                PreselectionCriteriaId = "CRIT_002",
                MaxPoints = data.FormationsPoints,
                CreatedAt = DateTime.UtcNow
            };
            await _repo.AddJobPreselectionCriteria(formationCriteria);

            await _repo.AddFormation(new JobCriteriaFormation
            {
                JobCriteriaId = formationCriteria.Id,
                Points = data.FormationsPoints
            });

        // ================= PRESENTATION =================
            var presentationCriteria = new JobDescriptionCriteria
            {
                JobDescriptionId = data.JobDescId,
                PreselectionCriteriaId = "CRIT_005",
                MaxPoints = data.PresentationsPoints,
                CreatedAt = DateTime.UtcNow
            };
            await _repo.AddJobPreselectionCriteria(presentationCriteria);

            await _repo.AddPresentation(new JobCriteriaPresentation
            {
                JobCriteriaId = presentationCriteria.Id,
                Points = data.PresentationsPoints
            });

        // ================= LANGUES =================
            var languageCriteria = new JobDescriptionCriteria
            {
                JobDescriptionId = data.JobDescId,
                PreselectionCriteriaId = "CRIT_004",
                MaxPoints = data.LangagesPoints,
                CreatedAt = DateTime.UtcNow
            };
            await _repo.AddJobPreselectionCriteria(languageCriteria);

            foreach (var lang in data.Langages)
            {
                var speaking = dict[(lang.LangageId, lang.LevelId)];

                await _repo.AddSpeaking(new JobCriteriaSpeaking
                {
                    JobCriteriaId = languageCriteria.Id,
                    LangageSpeakingId = speaking.Id,
                    Points = lang.Points
                });
            }

        // ================= EXPERIENCE =================
            var experienceCriteria = new JobDescriptionCriteria
            {
                JobDescriptionId = data.JobDescId,
                PreselectionCriteriaId = "CRIT_003",
                MaxPoints = data.ExperiencesPoints,
                CreatedAt = DateTime.UtcNow
            };
            await _repo.AddJobPreselectionCriteria(experienceCriteria);

            foreach (var exp in data.Experiences)
            {
                await _repo.AddExperience(new JobCriteriaExperience
                {
                    JobCriteriaId = experienceCriteria.Id,
                    MinYear = exp.Minimum,
                    MaxYear = exp.Maximum,
                    Points = exp.Points
                });
            }

        // ================= COMMIT =================
            await _dbService.CommitAsync();

            _logger.LogInformation("Insertion réussie");
        }
        catch (Exception ex) {
            await _dbService.RollbackAsync();
            _logger.LogError(ex, "Erreur insertion critères");
            throw;
        }
    }


    public async Task<JobCriteriaDTO> UpdateJobPreselectionCriteria(string jobId, JobCriteriaFormDTO data) {
        await _dbService.BeginTransactionAsync();

        try {
            _logger.LogInformation("Mise à jour des critères pour le TDR {jobId}", jobId);

            var job = await _jobRepo.GetByIdWithCriteria(jobId)
                ?? throw new ArgumentException("TDR introuvable");

            if (job.Criteria == null || !job.Criteria.Any())
                throw new InvalidOperationException("Aucun critère à modifier");

            // BLOQUER SI VALIDÉ
            if (job.Criteria.Any(c => c.ValidatedAt != null))
                throw new InvalidOperationException("Certains critères sont déjà validés et ne peuvent plus être modifiés");

            // ================= VALIDATION LANGUES =================
            var langageIds = data.Langages.Select(l => l.LangageId).ToList();
            var levelIds = data.Langages.Select(l => l.LevelId).ToList();

            var speakingLangages = await _repo.GetLangageSpeakings(langageIds, levelIds);

            var dict = speakingLangages.ToDictionary(
                s => (s.LangageId, s.SpeakingLevelId),
                s => s
            );

            if (data.Langages.Any(l => !dict.ContainsKey((l.LangageId, l.LevelId))))
                throw new ArgumentException("Certaines langues/niveaux sont invalides");

            // ================= NIVEAU D'ETUDE =================
            var educationCriteria = await _repo.GetByJobAndCriteriaAsync(jobId, "CRIT_001")
                ?? throw new ArgumentException("Critère niveau d'étude introuvable");

            educationCriteria.MaxPoints = data.LevelEducationsPoints;
            educationCriteria.UpdatedAt = DateTime.UtcNow;

            _repo.UpdateJobCriteria(educationCriteria);

            await _repo.RemoveLevelEducations(educationCriteria.Id);

            foreach (var l in data.LevelEducation)
            {
                await _repo.AddLevelEducation(new JobCriteriaLevelEducation
                {
                    JobCriteriaId = educationCriteria.Id,
                    LevelEducationId = l.LevelId,
                    Points = l.Points
                });
            }

            // ================= FORMATION =================
            var formationCriteria = await _repo.GetByJobAndCriteriaAsync(jobId, "CRIT_002")
                ?? throw new ArgumentException("Critère formation introuvable");

            formationCriteria.MaxPoints = data.FormationsPoints;
            formationCriteria.UpdatedAt = DateTime.UtcNow;

            _repo.UpdateJobCriteria(formationCriteria);

            await _repo.RemoveFormations(formationCriteria.Id);

            await _repo.AddFormation(new JobCriteriaFormation
            {
                JobCriteriaId = formationCriteria.Id,
                Points = data.FormationsPoints
            });

            // ================= EXPERIENCE =================
            var experienceCriteria = await _repo.GetByJobAndCriteriaAsync(jobId, "CRIT_003")
                ?? throw new ArgumentException("Critère expérience introuvable");

            experienceCriteria.MaxPoints = data.ExperiencesPoints;
            experienceCriteria.UpdatedAt = DateTime.UtcNow;

            _repo.UpdateJobCriteria(experienceCriteria);

            await _repo.RemoveExperiences(experienceCriteria.Id);

            foreach (var exp in data.Experiences)
            {
                await _repo.AddExperience(new JobCriteriaExperience
                {
                    JobCriteriaId = experienceCriteria.Id,
                    MinYear = exp.Minimum,
                    MaxYear = exp.Maximum,
                    Points = exp.Points
                });
            }

            // ================= LANGUES =================
            var languageCriteria = await _repo.GetByJobAndCriteriaAsync(jobId, "CRIT_004")
                ?? throw new ArgumentException("Critère langues introuvable");

            languageCriteria.MaxPoints = data.LangagesPoints;
            languageCriteria.UpdatedAt = DateTime.UtcNow;

            _repo.UpdateJobCriteria(languageCriteria);

            await _repo.RemoveSpeakings(languageCriteria.Id);

            foreach (var lang in data.Langages)
            {
                var speaking = dict[(lang.LangageId, lang.LevelId)];

                await _repo.AddSpeaking(new JobCriteriaSpeaking
                {
                    JobCriteriaId = languageCriteria.Id,
                    LangageSpeakingId = speaking.Id,
                    Points = lang.Points
                });
            }

            // ================= PRESENTATION =================
            var presentationCriteria = await _repo.GetByJobAndCriteriaAsync(jobId, "CRIT_005")
                ?? throw new ArgumentException("Critère présentation introuvable");

            presentationCriteria.MaxPoints = data.PresentationsPoints;
            presentationCriteria.UpdatedAt = DateTime.UtcNow;

            _repo.UpdateJobCriteria(presentationCriteria);

            await _repo.RemovePresentations(presentationCriteria.Id);

            await _repo.AddPresentation(new JobCriteriaPresentation
            {
                JobCriteriaId = presentationCriteria.Id,
                Points = data.PresentationsPoints
            });

            // ================= COMMIT =================
            await _dbService.CommitAsync();
            _logger.LogInformation("Mise à jour réussie");

            // === Construire l'objet JobCriteriaDTO à retourner ===
            var levelEducations = new List<LevelEducationDataDTO>();
            foreach (var l in data.LevelEducation)
            {
                var levelName = await _repo.GetLevelNameById(l.LevelId) ?? "";
                levelEducations.Add(new LevelEducationDataDTO
                {
                    LevelId = l.LevelId,
                    LevelName = levelName,
                    Points = l.Points
                });
            }

            var langages = new List<LangageDataDTO>();
            foreach (var l in data.Langages)
            {
                var langageName = await _repo.GetLangageNameById(l.LangageId) ?? "";
                var levelName = await _repo.GetLangageLevelById(l.LevelId) ?? "";
                langages.Add(new LangageDataDTO
                {
                    LangageId = l.LangageId,
                    Langage = langageName,
                    LevelId = l.LevelId,
                    Level = levelName,
                    Points = l.Points
                });
            }

            var updatedCriteria = new JobCriteriaDTO
            {
                LevelEducationsPoints = data.LevelEducationsPoints,
                LevelEducations = levelEducations,
                FormationsPoints = data.FormationsPoints,
                PresentationsPoints = data.PresentationsPoints,
                ExperiencesPoints = data.ExperiencesPoints,
                Experiences = data.Experiences.Select(e => new ExperienceDataDTO
                {
                    MinYear = e.Minimum,
                    MaxYear = e.Maximum,
                    Points = e.Points
                }).ToList(),
                LangagesPoints = data.LangagesPoints,
                Langages = langages,
                TotalScore = data.LevelEducationsPoints + data.FormationsPoints +
                            data.PresentationsPoints + data.ExperiencesPoints + data.LangagesPoints,
                Status = presentationCriteria.ValidatedAt != null ? "Validée" : "Brouillon"
            };

            return updatedCriteria;
        }
        catch (Exception ex) {
            await _dbService.RollbackAsync();
            _logger.LogError(ex, "Erreur lors de la mise à jour");
            throw;
        }
    }


    public async Task<string> ConfirmCriteria(string jobId) {
        await _dbService.BeginTransactionAsync();

        try {
            _logger.LogInformation("Confirmation en cours");


            var jobCriteria = await _jobRepo.GetByIdWithCriteria(jobId)
             ?? throw new ArgumentException("TDR non trouvé");

            var criteria = jobCriteria.Criteria;
            var now = DateTime.UtcNow;

            foreach (var item in criteria) {
                item.ValidatedAt = now;
            }

            await _dbService.CommitAsync();

            return jobCriteria.RequestId;
        }
        catch (Exception ex) {
            _logger.LogError(ex, "Erreur lors de la confirmation.");
            await _dbService.RollbackAsync();
            throw;
        }
    }
}
