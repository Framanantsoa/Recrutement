using System.Drawing;
using DocuSign.eSign.Model;
using Microsoft.EntityFrameworkCore;
using MyApp.Api.Data;
using MyApp.Api.Entities.recruitment;
using MyApp.Api.Models.dto.recruitment;
using MyApp.Api.Utils.generator;

namespace MyApp.Api.Repositories.recruitment;

public interface ICandidatureRepository
{
    Task<string> GenerateCandidatureId(string direction, int year);

    Task AddAsync(Candidature candidature, string department);
    Task AddCandidatureDetailAsync(CandidatureDetail detail);
    Task AddCandidatureLangageAsync(CandidatureLangage treatment);
    Task AddCandidatureFormationAsync(CandidatureFormation param);
    Task AddCandidatureScoreAsync(CandidatureScore param);

    Task<IEnumerable<Candidature>> GetByJobDescriptionIdAsync(string jobDescId,
     CandidatureFiltersDTO filters, int page, int pageSize);
    Task<Candidature?> GetCandidatureById(string id);
    Task<CandidatureDetailsDTO?> GetCandidatureDetails(string id);
    Task UpdateCriteriaPoints(string candidatureId, string criteriaId, decimal newPoints);
    Task<LangageSpeaking?> GetLangageSpeakingByIdsAsync(string langageId, string levelId);
    Task FinishCandidatureTreatment(string candidatureId);

// COMMENTAIRES
    Task AddCandidatureCommentAsync(CandidatureComment comment);
    Task<CandidatureComment?> GetByCommentIdAsync(string commId);
    Task<PaginatedResult<CandidatureComment>> GetPaginatedAsync(string id, int page, int pageSize);
    Task SoftDeleteCommentAsync(string cadId);
}


public class CandidatureRepository(AppDbContext context, 
 ISequenceGenerator seq) : ICandidatureRepository
{
    private readonly AppDbContext _dbCtx = context;
    private readonly ISequenceGenerator _seq = seq;

    public async Task<IEnumerable<Candidature>> GetByJobDescriptionIdAsync(
        string jobDescId,
        CandidatureFiltersDTO filters,
        int page,
        int pageSize)
    {
        var query = _dbCtx.Candidatures
            .Include(c => c.JobDescription)
                .ThenInclude(j => j.Request)
            .Include(c => c.CandidatureScores)
            .Where(c => c.JobDescriptionId == jobDescId);

        // filtre nom
        if (!string.IsNullOrWhiteSpace(filters.Name)) {
            var name = filters.Name.ToLower();

            query = query.Where(c => (c.FirstName + " " + c.LastName)
                .ToLower()
                .Contains(name)
            );
        }

        // filtre date min
        if (filters.SendingMinDate.HasValue) {
            var minDate = filters.SendingMinDate.Value.ToDateTime(TimeOnly.MinValue);

            query = query.Where(c => c.CreatedAt >= minDate);
        }

        // filtre date max
        if (filters.SendingMaxDate.HasValue) {
            var maxDate = filters.SendingMaxDate.Value.ToDateTime(TimeOnly.MaxValue);

            query = query.Where(c => c.CreatedAt <= maxDate);
        }

        // filtre traité / non traité
        if (filters.Treated.HasValue) {
            query = query.Where(c => c.IsTreated == filters.Treated.Value);
        }

        return await query
            .AsNoTracking()
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }


    public async Task<string> GenerateCandidatureId(string direction, int year) {
        var key = $"CAD_{direction}_{year}";
        string lastYear = (year%100).ToString("D2");

    // Ex : CAD-DRH/260001
        return await _seq.GenerateObjectId(key, $"CAD-{direction}/{lastYear}", 4, "");
    }

    private async Task<string> GenerateCandidatureDetailId() {
        return await _seq.GenerateObjectId("CAD_DET", "DET/CAD");
    }

    private async Task<string> GenerateCandidatureLangageId() {
        return await _seq.GenerateObjectId("CAD_LANG", "CAD/LANG");
    }

    private async Task<string> GenerateCandidatureFormationId() {
        return await _seq.GenerateObjectId("CAD_FORM", "CAD/FOR");
    }

    private async Task<string> GenerateCandidatureScoreId() {
        return await _seq.GenerateObjectId("CAD_POINT", "CAD/PTS");
    }

    private async Task<string> GenerateCandidatureCommentId() {
        return await _seq.GenerateObjectId("CAD_COMM", "COM/CAD");
    }


    public async Task AddAsync(Candidature candidature, string department) {
        var actualYear = DateTime.UtcNow.Year;
    
        candidature.Id = await GenerateCandidatureId(
            department, actualYear
        );

        await _dbCtx.Candidatures.AddAsync(candidature);
    }


    public async Task AddCandidatureDetailAsync(CandidatureDetail detail) {
        detail.Id = await GenerateCandidatureDetailId();
        await _dbCtx.CandidaturesDetails.AddAsync(detail);
    }

    public async Task AddCandidatureLangageAsync(CandidatureLangage treatment) {
        treatment.Id = await GenerateCandidatureLangageId();
        await _dbCtx.CandidatureLangages.AddAsync(treatment);
    }

    public async Task AddCandidatureFormationAsync(CandidatureFormation param) {
        param.Id = await GenerateCandidatureFormationId();
        await _dbCtx.CandidatureFormations.AddAsync(param);
    }

    public async Task AddCandidatureScoreAsync(CandidatureScore param) {
        param.Id = await GenerateCandidatureScoreId();
        await _dbCtx.CandidatureScores.AddAsync(param);
    }


    public async Task<LangageSpeaking?> GetLangageSpeakingByIdsAsync(string langageId, string levelId) {
        return await _dbCtx.LangagesSpeakings
        .Include(ls => ls.Langage)
        .Include(ls => ls.SpeakingLevel)
        .FirstOrDefaultAsync(ls =>
            ls.LangageId == langageId &&
            ls.SpeakingLevelId == levelId);
    }


    public async Task UpdateCriteriaPoints(string candidatureId,
        string criteriaId, decimal newPoints
    ) {
        var candidature = await _dbCtx.Candidatures
            .FirstOrDefaultAsync(c => c.Id == candidatureId)
            ?? throw new ArgumentException("Candidature non trouvée");

        var jobCriteria = await _dbCtx.JobDescriptionCriterias
            .FirstOrDefaultAsync(jc =>
                jc.JobDescriptionId == candidature.JobDescriptionId &&
                jc.PreselectionCriteriaId == criteriaId)
            ?? throw new ArgumentException("Critère du job non trouvé");

        var canditatNote = await _dbCtx.CandidatureScores
            .Include(cs => cs.Criteria)
            .FirstOrDefaultAsync(cs =>
                cs.CandidatureId == candidatureId &&
                cs.Criteria.PreselectionCriteriaId == criteriaId)
            ?? throw new ArgumentException("Score de candidature non trouvé");

        // VALIDATION
        if (newPoints > jobCriteria.MaxPoints) {
            throw new ArgumentException($"Le score ne peut pas dépasser {(int)jobCriteria.MaxPoints} points");
        }

        if (newPoints < 0) {
            throw new ArgumentException("Le score ne peut pas être négatif");
        }
        canditatNote.Points = newPoints;

        await _dbCtx.SaveChangesAsync();
    }


    public async Task FinishCandidatureTreatment(string candidatureId) {
        var candidature = await _dbCtx.Candidatures
            .Include(c => c.CandidatureScores)
                .ThenInclude(cs => cs.Criteria)
            .FirstOrDefaultAsync(c => c.Id.Equals(candidatureId))
         ?? throw new ArgumentException("Candidature non trouvée");

        candidature.IsTreated = true;

        var points = candidature.CandidatureScores.Select(n => n.Points);
        
    // éliminé directement si critère = 0
        if(points.Any(p => p==0)) {
            candidature.IsPreselected = false;
        }
        else {
        // 1. Calcul du score total du candidat
            var totalCandidateScore = points.Sum();

        // 2. Calcul du score max du TDR
            var totalMaxScore = candidature.CandidatureScores
                .Select(cs => cs.Criteria.MaxPoints)
                .Distinct() // évite doublons si jamais
                .Sum();

        // 3. Seuil à 60%
            decimal percentage = 60m;
            decimal minThreshold = totalMaxScore * (percentage / 100m);

        // 4. Comparaison
            candidature.IsPreselected = totalCandidateScore >= minThreshold;
        }

        await _dbCtx.SaveChangesAsync();
    }


    public async Task<Candidature?> GetCandidatureById(string id) {
        return await _dbCtx.Candidatures
            .Include(c => c.JobDescription)
            .Include(c => c.CandidatureScores)
                .ThenInclude(cs => cs.Criteria)
                    .ThenInclude(jc => jc.PreselectionCriteria)
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);
    }


    public async Task<CandidatureDetailsDTO?> GetCandidatureDetails(string id) {
        return await _dbCtx.Candidatures
            .Where(c => c.Id == id)
            .Select(c => new {
                c,
                Years = c.CandidatureDetails
                    .Select(cd => cd.YearsOfExperience)
                    .FirstOrDefault(),

                LevelEducationName = c.CandidatureDetails
                    .Select(cd => cd.LevelEducation.Name)
                    .FirstOrDefault(),

                LangagesSkills = c.CandidatureDetails
                    .Select(cd => cd.CandidatureLangages.Select(ct => new LangageSkillDTO
                    {
                        Langage = ct.LangageSpeaking.Langage.Name,
                        Level = ct.LangageSpeaking.SpeakingLevel.Name,
                        LevelCode = ct.LangageSpeaking.SpeakingLevel.Code,
                    }).ToList())
                    .FirstOrDefault(),

                Formations = c.CandidatureFormations
                    .Select(cf => cf.Formation).ToArray()
            })
            .Select(x => new CandidatureDetailsDTO
            {
                Id = x.c.JobDescription.Id,
                FirstName = x.c.FirstName,
                LastName = x.c.LastName,
                Email = x.c.EmailContact,

                LmUrl = x.c.LmUrl,
                CvUrl = x.c.CvUrl,

                YearsOfExperience = x.Years,
                LevelEducation = x.LevelEducationName ?? "N/A",

                LangagesSkills = x.LangagesSkills ?? new List<LangageSkillDTO>(),
                Formations = x.Formations,

                SendingDateTime = x.c.CreatedAt,
                IsTreated = x.c.IsTreated,
                IsPreselected = x.c.IsPreselected
            })
            .FirstOrDefaultAsync();
    }


    public async Task AddCandidatureCommentAsync(CandidatureComment comment) {
        comment.Id = await GenerateCandidatureCommentId();
        await _dbCtx.CandidatureComments.AddAsync(comment);
    }

    public async Task<CandidatureComment?> GetByCommentIdAsync(
        string commId
    ) {
        return await _dbCtx.CandidatureComments
            .FirstOrDefaultAsync(c => c.Id == commId && !c.IsDeleted);
    }

    public async Task<PaginatedResult<CandidatureComment>> GetPaginatedAsync(
        string id, int page, int pageSize
    ) {
        var query = _dbCtx.CandidatureComments
            .Include(c => c.User)
            .Where(c => !c.IsDeleted && c.CandidatureId == id);

        var totalCount = await query.CountAsync();

        var list = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PaginatedResult<CandidatureComment> {
            List = list,
            TotalCount = totalCount
        };
    }

    public async Task SoftDeleteCommentAsync(string commentId) {
        var comment = await _dbCtx.CandidatureComments
            .FirstOrDefaultAsync(c => !c.IsDeleted && c.Id == commentId);

        if (comment != null) {
            comment.IsDeleted = true;
            comment.DeletedAt = DateTime.UtcNow;
        }
    }
}
