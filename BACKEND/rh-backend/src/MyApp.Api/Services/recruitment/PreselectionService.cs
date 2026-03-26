using MyApp.Api.Entities.recruitment;
using MyApp.Api.Models.dto.recruitment;
using MyApp.Api.Repositories.recruitment;

namespace MyApp.Api.Services.recruitment;

public interface IPreselectionService
{
    Task<List<Langage>> GetAllLangagesAsync();
    Task<List<SpeakingLevel>> GetAllSpeakingLevelsAsync();
    Task<PreselectionCriterionDTO> GetAllPreselectionCriterionAsync();
    Task<PreselectionCriterion> UpdateCriterionCoefficientAsync(string criterionId, decimal coefficient);
}


public class PreselectionService(
    IPreselectionRepository r1, ILogger<PreselectionService> log
) : IPreselectionService
{
    private readonly ILogger<PreselectionService> _logger = log;
    private readonly IPreselectionRepository _repo = r1;


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


    public async Task<PreselectionCriterionDTO> GetAllPreselectionCriterionAsync() {
        int baseScore = 5; // Exemple de score de base pour chaque critère

        try {
            _logger.LogInformation("Recherche des critères de présélection en cours ...");
            var criteria = await _repo.GetAllPreselectionCriterionAsync();

            var criteriaWithScore = criteria.Select(c => new PreselectionCriterionWithScoreDTO {
                Id = c.Id,
                Criterion = c.Criterion,
                Coefficient = c.Coefficient,
                Score = c.Coefficient * baseScore // Exemple de calcul de score
            }).ToList();

            return new PreselectionCriterionDTO {
                Criteria = criteriaWithScore,
                TotalScore = criteriaWithScore.Sum(c => c.Coefficient*baseScore)
            };
        }
        catch(Exception ex) {
            _logger.LogError(ex, "Erreur lors de la recherche des critères de présélection");
            throw;
        }
    }


    public async Task<PreselectionCriterion> UpdateCriterionCoefficientAsync(string criterionId, decimal coefficient) {
        try {
            _logger.LogInformation("Mise à jour du coefficient d'un critère de présélection en cours ...");
            return await _repo.UpdateCriterionCoefficientAsync(criterionId, coefficient);
        }
        catch(Exception ex) {
            _logger.LogError(ex, "Erreur lors de la mise à jour du coefficient d'un critère de présélection");
            throw;
        }
    }
}
