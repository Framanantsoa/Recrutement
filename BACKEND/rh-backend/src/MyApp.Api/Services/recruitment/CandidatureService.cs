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
    Task<(PreselectionCriteriaDTO, CandidatureDetailsDTO)> GetCandidatureDetailsAsync(string id);
    
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
        var candidaturesEntity = await _repo.GetByJobDescriptionIdAsync(jobDescId, filters, page, pageSize);
        var criteria = await _preselectService.GetAllPreselectionCriteriaAsync();

        // calculer le score total pour chaque candidature
        var candidaturesDTO = new List<CandidatureDTO>();
        foreach (var c in candidaturesEntity) {
            var points = c.CandidatureScores;
            var totalScore = points
                .Join(criteria.Criteria, p => p.CriteriaId, c => c.Id, (p, c) => p.Points * c.Coefficient)
                .Sum();

            candidaturesDTO.Add(new CandidatureDTO {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Email = c.EmailContact,
                LmUrl = c.LmUrl ?? "N/A",
                CvUrl = c.CvUrl ?? "N/A",
                SendingDateTime = c.CreatedAt,
                IsTreated = c.IsTreated,
                IsPreselected = c.IsPreselected,
                TotalScore = totalScore,
                MaxScore = criteria.TotalScore
            });
        }

        // filtrer uniquement ceux qui sont présélectionnés
        if (filters.IsPreselected) {
            candidaturesDTO = candidaturesDTO
                .Where(c => c.IsPreselected==true && c.IsTreated == true)
                .OrderByDescending(c => c.TotalScore) // tri par score total
                .ToList();
        }
        else {
            candidaturesDTO = candidaturesDTO
                .OrderByDescending(c => c.SendingDateTime) // tri par date
                .ToList();
        }

        // préparer details
        var jobDesc = await _jobDescRepo.GetJobDescriptionById(jobDescId);
        var detailsDTO = new CandidaturesDetailsDTO
        {
            Contract = jobDesc.Request.Contract?.Code ?? jobDesc.Request.ContractPrecision ?? "N/A",
            Direction = jobDesc.Request.HierarchicalManager.Department ?? "N/A",
            Post = jobDesc.Request.Post ?? "N/A",
        };

        return (candidaturesDTO, detailsDTO);
    }


    public async Task<(PreselectionCriteriaDTO, CandidatureDetailsDTO)> GetCandidatureDetailsAsync(string id) {
        try {
            _logger.LogInformation("Récupération des détails de la candidature {Id}", id);
            
            var details = await _repo.GetCandidatureDetails(id);
            var candidature = await _repo.GetCandidatureById(id);
            var criteria = await _preselectService.GetAllPreselectionCriteriaAsync();

            if (details == null || candidature == null) {
                _logger.LogWarning("Candidature non trouvée pour l'ID {Id}", id);
                throw new InvalidOperationException("Candidature non trouvée");
            }

            var points = candidature.CandidatureScores;
            details.Points = points;

            // CALCUL DU TOTAL
            var totalScore = (
                from p in points
                join c in criteria.Criteria on p.CriteriaId equals c.Id
                select p.Points * c.Coefficient
            ).Sum();

            // Ajoute le total dans ton DTO
            details.TotalScore = totalScore;

            return (criteria, details);
        } 
        catch (Exception ex) {
            _logger.LogError(ex, "Erreur lors de la récupération des détails de la candidature {Id}", id);
            throw;
        }
    }


    private async Task AssignCandidatureScoresAsync(Candidature candidature) {
        try {
            _logger.LogInformation("Définition automatique des notes de la candidature {id}", candidature.Id);
            await _dbService.BeginTransactionAsync();

        // Note auto du niveau d'étude
        // Note auto des années d'exp.
        // Note auto des compétences linguistiques

        // Note manuel des formations
        // Note manuel de la clarté CV + LM

            await _dbService.CommitAsync();
        }
        catch (Exception ex) {
            _logger.LogError(ex, "Erreur lors de la définition des nots");

            await _dbService.RollbackAsync();
            throw;
        }
    }


    public async Task AddCandidature(string jobId, CandidatureFormDTO data) {
        try {
            _logger.LogInformation("Insertion de la nouvelle candidature de : {email}...", data.Email);
            
            await _dbService.BeginTransactionAsync();

        // Infos générales
            Candidature newCandidature = new() {
                FirstName = data.FirstName,
                LastName = data.LastName,
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

        // Compétences linguistiques
            foreach (var lang in data.Langages) {
                var langageSpeaking = await _repo.GetLangageSpeakingByIdsAsync(lang.LangageId, lang.LevelId);

                if (langageSpeaking == null) {
                    _logger.LogWarning("Langue ou niveau non trouvé pour LangageId: {LangageId}, LevelId: {LevelId}",
                     lang.LangageId, lang.LevelId);
                    continue; // Ignorer cette compétence linguistique
                }

                CandidatureLangage treatment = new() {
                    CandidatureDetailId = detail.Id,
                    LangageSpeakingId = langageSpeaking.Id,
                };
                await _repo.AddCandidatureLangageAsync(treatment);
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
