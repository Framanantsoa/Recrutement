using MyApp.Api.Entities.recruitment;
using MyApp.Api.Entities.users;
using MyApp.Api.Models.dto.recruitment;
using MyApp.Api.Models.dto.users;
using MyApp.Api.Repositories.recruitment;
using MyApp.Api.Repositories.users;
using MyApp.Api.Services.logs;
using MyApp.Api.Services.users;

namespace MyApp.Api.Services.recruitment;

public interface IJobInterviewService
{
    Task AddPlaning(PlaningFormDTO plan);
    Task<List<Planing>> GetPlaningsPerMonthAsync(string userId, int? year, int? month);
    Task AddJobInterview(JobInterview interview);
    Task<(bool, bool)> CanUserPlanJobInterview(string userId, string jobDescId);
    Task<bool> CanUserPlanJobInterviewByCandidature(string userId, string candId);
    Task PassToNextInterviewValidator(string candId);
    Task<List<Planing>> GetAllPlaningsToDoForUser(string userId,
     DateOnly dateMin, DateOnly dateMax);
}

public class JobInterviewService(IJobInterviewRepository jobRep,
 ILogger<JobInterviewService> log, ILogService logS,
 IUnitOfWorkService db, IJobDescriptionService jobParam,
 IUserRepository uRepo, ICandidatureRepository cand)
 : IJobInterviewService
{
    private readonly IJobInterviewRepository _interviewRepo = jobRep;
    private readonly ICandidatureRepository _candRepo = cand;
    private readonly ILogger<JobInterviewService> _logger = log;
    private readonly IUnitOfWorkService _dbService = db;
    private readonly IUserRepository _uRepo = uRepo;
    private readonly ILogService _logService = logS;
    private readonly IJobDescriptionService _jobService = jobParam;


    public async Task AddPlaning(PlaningFormDTO plan) {
        try {
            _logger.LogInformation("Ajout de la planification en cours");

            await _dbService.BeginTransactionAsync();

            Planing planing = new() {
                CandidatureId = plan.CandidatureId,
                ValidatorId = plan.ValidatorId,
                DateTime = plan.DateTime
            };

            await _interviewRepo.AddPlaning(planing);

        // Envoi de mail vers le candidat
            await _dbService.CommitAsync();

        // Création de log
            await _logService.LogAsync("PLANIFICATION D'ENTRETIEN", "planifications",
             plan.ValidatorId);
        }
        catch (Exception ex) {
            _logger.LogError(ex, "Erreur lors de l'ajout de planification");
            throw;
        }
    }


    private async Task<UserDto> GetNextInterviewValidator(string candidatureId) {
        try {
            _logger.LogInformation("Récupération du prochain validateur d'entretien en cours");
            var candidature = await _candRepo.GetCandidatureById(candidatureId)
             ?? throw new ArgumentException("Candidature non trouvée");
            var interviewers = await _jobService.GetAllInterviewers(candidature.JobDescriptionId);

            if(interviewers.Count == 0)
                throw new ArgumentException("Aucun validateur défini pour ce poste");

            var userIds = interviewers.Select(i => i.UserId).ToList();

            var planings = await _interviewRepo.GetPlaningsByCandidature(candidature.Id);
            int planingsCount = planings.Count;

            if(planingsCount >= interviewers.Count)
                throw new ArgumentException("Tous les validateurs ont déjà planifié un entretien pour cette candidature");

            string nextValidatorId = userIds[planingsCount];
            var nextValidator = await _uRepo.GetByIdAsync(nextValidatorId)
            ?? throw new ArgumentException($"Utilisateur avec ID {nextValidatorId} non trouvé");

            _logger.LogInformation("Prochain validateur d'entretien: {name}", nextValidator.Name);
            return UserService.MapToDto(nextValidator);
        }
        catch (Exception ex) {
            _logger.LogError(ex, "Erreur lors de la récupération du validateur suivant");
            throw;
        }
    }


    public async Task PassToNextInterviewValidator(string candId) {
        try {
            _logger.LogInformation("Passage de la candidature au prochain validateur en cours");
            var nextValidator = await GetNextInterviewValidator(candId);
            
            PlaningFormDTO data = new() {
                CandidatureId = candId,
                ValidatorId = nextValidator.UserId,
                DateTime = null
            };

            await AddPlaning(data);
        }
        catch (Exception ex) {
            _logger.LogError(ex, "Erreur lors du passage de la candidature au prochain validateur");
            throw;
        }
    }


    public async Task AddJobInterview(JobInterview interview) {
        try {
            _logger.LogInformation("Ajout de la décision d'entretien en cours");

            await _dbService.BeginTransactionAsync();
            await _interviewRepo.AddJobInterview(interview);

            await _dbService.CommitAsync();

        // Création de log
            await _logService.LogAsync("INSERTION D'ENTRETIEN", "entretiens",
             interview.Planing.ValidatorId);
        }
        catch (Exception ex) {
            _logger.LogError(ex, "Erreur lors de l'insertion de l'entretien");
            throw;
        }
    }


    public async Task<(bool, bool)> CanUserPlanJobInterview(string userId, string jobDescId) {
        bool required = false; 
        bool canPlan = false;

        try {
            _logger.LogInformation("Vérification de planification en cours");
            
            var jobDesc = await _jobService.GetJobDescriptionEditById(jobDescId)
             ?? throw new ArgumentException("TDR non trouvé");
            User user = await _uRepo.GetByIdAsync(userId)
             ?? throw new ArgumentException("Utilisateur avec ID '{id}' non trouvé", userId);

            var interviewers = await _jobService.GetAllInterviewers(jobDescId);

            List<string> userIds = interviewers.Select(i => i.UserId).ToList();

            if(userIds.Contains(userId)) {
                int indexOfValidator = userIds.IndexOf(userId);

                canPlan = true;

                if(indexOfValidator==0 || (indexOfValidator==userIds.Count-1
                 && jobDesc.PostTypeId=="TYP_POS-0001"))
                    required = true;
            }
            else required = false;

            return (canPlan, required);
        }
        catch (Exception ex) {
            _logger.LogError(ex, "Erreur lors de la vérification");
            throw;
        }
    }


    public async Task<bool> CanUserPlanJobInterviewByCandidature(string userId, string candId) {
        try {
            _logger.LogInformation("Vérification de planification en cours");
            bool canPlan = false;
            
            var candidature = await _candRepo.GetCandidatureById(candId)
             ?? throw new ArgumentException("Candidature non trouvée");
            string jobDescId = candidature.JobDescriptionId;

            User user = await _uRepo.GetByIdAsync(userId)
             ?? throw new ArgumentException("Utilisateur avec ID {userId} non trouvé", userId);
            
            var interviewers = await _jobService.GetAllInterviewers(jobDescId);

            foreach(var interviewer in interviewers) {
                _logger.LogInformation("Interviewer: {name}", interviewer.Name);
            }

            List<string> userIds = interviewers.Select(i => i.UserId).ToList();

            if(userIds.Contains(userId)) {
                int indexOfValidator = userIds.IndexOf(userId);

            // Les planifications faites sur la candidature
                List<Planing> planings = await _interviewRepo.GetPlaningsByCandidature(candId);
                if(planings.Count == indexOfValidator) canPlan = true;
            }

            return canPlan;
        }
        catch (Exception ex) {
            _logger.LogError(ex, "Erreur lors de la vérification");
            throw;
        }
    } 


    public async Task<List<Planing>> GetPlaningsPerMonthAsync(string userId,
        int? year, int? month
    ) {
        try {
        // Valeurs par défaut
            var currentDate = DateTime.Now;
            int finalYear = year ?? currentDate.Year;
            int finalMonth = month ?? currentDate.Month;

        // Validation du mois
            if (finalMonth < 1 || finalMonth > 12)
                throw new ArgumentException("Le mois doit être compris entre 1 et 12");

            _logger.LogInformation(
                "Extraction des planifications pour {year}-{month}",
                finalYear, finalMonth
            );

            var user = await _uRepo.GetByIdAsync(userId)
                ?? throw new ArgumentException($"Utilisateur ID {userId} non trouvé");

            var planings = await _interviewRepo
                .GetAllPlaningsToDoForUser(user, finalYear, finalMonth);

            return planings;
        }
        catch (Exception ex) {
            _logger.LogError(ex, "Erreur lors de l'extraction des planifications");
            throw;
        }
    }


    public async Task<List<Planing>> GetAllPlaningsToDoForUser(string userId,
     DateOnly dateMin, DateOnly dateMax) {
        try {
            _logger.LogInformation(
                "Extraction de toutes les planifications à faire pour l'utilisateur {userId}", userId
            );

            var user = await _uRepo.GetByIdAsync(userId)
                ?? throw new ArgumentException($"Utilisateur ID {userId} non trouvé");

            var planings = await _interviewRepo
                .GetAllPlaningsToDoForUser(user, dateMin.Year, dateMin.Month);
                
            return planings;
        }
        catch (Exception ex) {
            _logger.LogError(ex, "Erreur lors de l'extraction des planifications");
            throw;
        }
    }
}
