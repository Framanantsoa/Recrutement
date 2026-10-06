using MyApp.Api.Models.dto.recruitment;
using MyApp.Api.Repositories.recruitment;

namespace MyApp.Api.Services.recruitment;

public interface IDashboardService
{
    Task<DashboardStatsDTO> GetDashboardStatsAsync(string direction);
    Task<IEnumerable<RequestPerDirectionDTO>> GetRequestsPerDirectionAsync();
    Task<IEnumerable<RequestPerStatusDTO>> GetRequestsPerStatusAsync(string direction);
    Task<IEnumerable<CandidaturePerMonthDTO>> GetCandidaturesPerMonthAsync(
     string direction, int year);
}

public class DashboardService(IDashboardRepository dashRepo,
 ILogger<CandidatureService> logger) : IDashboardService
{
    private readonly ILogger<CandidatureService> _logger = logger;
    private readonly IDashboardRepository _dashboardRepository = dashRepo;


    public async Task<DashboardStatsDTO> GetDashboardStatsAsync(string direction) {
        try {
            _logger.LogInformation("Extraction des statistiques pour la direction {direction}"
            , direction);

            return await _dashboardRepository.GetDashboardStatsAsync(direction);
        } 
        catch (Exception ex) {
            _logger.LogError(ex, "Erreur lors de l'extraction des statistiques");
            throw;
        }
    }


    public async Task<IEnumerable<RequestPerDirectionDTO>> GetRequestsPerDirectionAsync() {
        try {
            _logger.LogInformation("Extraction du nombre de demandes par direction");

            return await _dashboardRepository.GetRequestsPerDirectionAsync();
        } 
        catch (Exception ex) {
            _logger.LogError(ex, "Erreur lors de l'extraction du nombre de demandes par direction");
            throw;
        }
    }


    public async Task<IEnumerable<RequestPerStatusDTO>> GetRequestsPerStatusAsync(string direction) {
        try {
            _logger.LogInformation("Extraction du nombre de demandes par statut");

            return await _dashboardRepository.GetRequestsPerStatusAsync(direction);
        } 
        catch (Exception ex) {
            _logger.LogError(ex, "Erreur lors de l'extraction du nombre de demandes par statut");
            throw;
        }
    }


    public async Task<IEnumerable<CandidaturePerMonthDTO>> GetCandidaturesPerMonthAsync(
     string direction, int year) {
        try {
            _logger.LogInformation("Extraction du nombre de candidatures par mois pour l'année {year}"
            , year);

            return await _dashboardRepository.GetCandidaturesPerMonthAsync(direction, year);
        } 
        catch (Exception ex) {
            _logger.LogError(ex, "Erreur lors de l'extraction du nombre de candidatures par mois");
            throw;
        }
    }
}
