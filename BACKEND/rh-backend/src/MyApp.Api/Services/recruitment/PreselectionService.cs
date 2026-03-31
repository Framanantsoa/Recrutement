using MyApp.Api.Entities.recruitment;
using MyApp.Api.Models.dto.recruitment;
using MyApp.Api.Repositories.recruitment;

namespace MyApp.Api.Services.recruitment;

public interface IPreselectionService
{
    Task<List<Langage>> GetAllLangagesAsync();
    Task<List<SpeakingLevel>> GetAllSpeakingLevelsAsync();
    // Task AddJobPreselectionCriteria(JobCriteriaFormDTO data);
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

    // public async Task AddJobPreselectionCriteria(JobCriteriaFormDTO data) {
    //     try {
    //         _logger.LogInformation("Insertion des critères de présélection d'un TDR en cours ...");
    //         await _dbService.BeginTransactionAsync();        
    
    //     // 1. Création du threshold
    //         var criteria = new CriteriaThreshold {
    //             MinLevelEducationId = data.MinLevelEducationId,
    //             MinExperienceYears = data.MinExperienceYears
    //         };
    //         await _repo.AddCriteriaThreshold(criteria);

    //     // 2. Récupération en une seule requête
    //         var langageIds = data.Langages.Select(l => l.LangageId).ToList();
    //         var levelIds = data.Langages.Select(l => l.LevelId).ToList();

    //         var speakingLangages = await _repo.GetLangageSpeakings(langageIds, levelIds);

    //     // 3. Mapping en mémoire avec Dictionary pour lookup O(1)
    //         var dict = speakingLangages.ToDictionary(
    //             s => (s.LangageId, s.SpeakingLevelId),
    //             s => s
    //         );

    //         var speakingCriteriaList = data.Langages.Select(lang => {
    //             if (!dict.TryGetValue((lang.LangageId, lang.LevelId), out var speaking))
    //                 throw new ArgumentException($"Niveau de langue non trouvé pour {lang.LangageId}/{lang.LevelId}");

    //             return new SpeakingCriteriaThreshold {
    //                 CriteriaThresholdId = criteria.Id,
    //                 MinSpeakingLevelId = speaking.Id
    //             };
    //         }).ToList();

    //     // 4. Insert en batch
    //         await _repo.AddSpeakingCriteriaThresholdRange(speakingCriteriaList);

    //     // 5. Lien avec le TDR  
    //         var jobCriteria = new JobDescriptionCriteria {
    //             JobDescriptionId = data.JobDescId,
    //             CriteriaThresholdId = criteria.Id
    //         };
    //         await _repo.AddJobPreselectionCriteria(jobCriteria);

    //     // Application des transactions
    //         await _dbService.CommitAsync();
    //     }
    //     catch(Exception ex) {
    //         _logger.LogError(ex, "Erreur lors de l'insertion des critères de présélection d'un TDR");
    //         throw;
    //     }
    // }
}
