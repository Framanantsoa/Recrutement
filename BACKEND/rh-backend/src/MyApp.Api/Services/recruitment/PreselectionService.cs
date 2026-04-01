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
        try {
            _logger.LogInformation("Insertion des critères de présélection...");

            await _dbService.BeginTransactionAsync();

            // =========================
            // 1. Vérifier Job
            // =========================
            var job = await _jobRepo.GetJobDescriptionById(data.JobDescId)
                ?? throw new ArgumentException("JobDescription introuvable");

            // =========================
            // 2. VALIDATION AVANT INSERT (CRITIQUE 🔥)
            // =========================

            // Vérifier langues AVANT insertion
            var langageIds = data.Langages.Select(l => l.LangageId).ToList();
            var levelIds = data.Langages.Select(l => l.LevelId).ToList();

            var speakingLangages = await _repo.GetLangageSpeakings(langageIds, levelIds);

            var dict = speakingLangages.ToDictionary(
                s => (s.LangageId, s.SpeakingLevelId),
                s => s
            );

            var missingLangs = data.Langages
                .Where(l => !dict.ContainsKey((l.LangageId, l.LevelId)))
                .ToList();

            if (missingLangs.Any())
            {
                throw new ArgumentException("Certaines langues/niveaux sont invalides");
            }

            // =========================
            // 3. EDUCATION
            // =========================
            var educationCriteria = new JobDescriptionCriteria
            {
                JobDescriptionId = data.JobDescId,
                PreselectionCriteriaId = "CRIT_001",
                MaxPoints = data.LevelEducationsPoints, // 🔥 corrigé
                CreatedAt = DateTime.UtcNow
            };

            await _repo.AddJobPreselectionCriteria(educationCriteria);

            await _repo.AddLevelEducation(new JobCriteriaLevelEducation
            {
                JobCriteriaId = educationCriteria.Id,
                LevelEducationId = data.LevelEducation.LevelId,
                Points = data.LevelEducation.Points
            });

            // =========================
            // 4. FORMATION
            // =========================
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

            // =========================
            // 5. PRESENTATION
            // =========================
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

            // =========================
            // 6. EXPERIENCE
            // =========================
            var experienceCriteria = new JobDescriptionCriteria
            {
                JobDescriptionId = data.JobDescId,
                PreselectionCriteriaId = "CRIT_003",
                MaxPoints = data.ExperiencesPoints, // 🔥 maintenant depuis DTO
                CreatedAt = DateTime.UtcNow
            };

            await _repo.AddJobPreselectionCriteria(experienceCriteria);

            var experiences = data.Experiences.Select(exp => new JobCriteriaExperience
            {
                JobCriteriaId = experienceCriteria.Id,
                MinYear = exp.Minimum,
                MaxYear = exp.Maximum,
                Points = exp.Points
            }).ToList();

            await _repo.AddExperienceRange(experiences);

            // =========================
            // 7. LANGUES
            // =========================
            var languageCriteria = new JobDescriptionCriteria
            {
                JobDescriptionId = data.JobDescId,
                PreselectionCriteriaId = "CRIT_004",
                MaxPoints = data.LangagesPoints, // 🔥 corrigé
                CreatedAt = DateTime.UtcNow
            };

            await _repo.AddJobPreselectionCriteria(languageCriteria);

            var speakingList = data.Langages.Select(lang =>
            {
                var speaking = dict[(lang.LangageId, lang.LevelId)];

                return new JobCriteriaSpeaking
                {
                    JobCriteriaId = languageCriteria.Id,
                    LangageSpeakingId = speaking.Id,
                    Points = lang.Points
                };
            }).ToList();

            await _repo.AddSpeakingRange(speakingList);

            // =========================
            // 8. COMMIT FINAL (🔥 tout ou rien)
            // =========================
            await _dbService.CommitAsync();

            _logger.LogInformation("Insertion réussie");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur insertion critères");

            await _dbService.RollbackAsync();
            throw;
        }
    }
}
