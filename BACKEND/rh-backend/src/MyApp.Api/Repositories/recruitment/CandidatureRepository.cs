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
    Task AddCandidatureTreatmentAsync(CandidatureTreatment treatment);
    Task AddCandidatureFormationAsync(CandidatureFormation param);
    Task<IEnumerable<Candidature>> GetByJobDescriptionIdAsync(string jobDescId,
     CandidatureFiltersDTO filters, int page, int pageSize);
    Task<Candidature?> GetCandidatureById(string id);
    Task<CandidatureDetailsDTO?> GetCandidatureDetails(string id);
    Task AssignCandidaturePointsAsync(string candidatureId);
    Task UpdateCriterionPoints(string candidatureId, string criterionId, decimal newPoints);
    Task<LangageSpeaking?> GetLangageSpeakingByIdsAsync(string langageId, string levelId);
    Task<List<CandidaturePoint>> GetCandidatPointsAsync(string id);
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
        var number = await _seq.GetNextValueAsync(key);

    // Ex : CAD-DRH/260001
        return $"CAD-{direction}/{year % 100}{number.ToString().PadLeft(4, '0')}";
    }

    private async Task<string> GenerateCandidatureDetailId() {
        var key = "CAD_DETAIL";
        var number = await _seq.GetNextValueAsync(key);

        return $"CADDET-{number.ToString().PadLeft(6, '0')}";
    }

    private async Task<string> GenerateCandidatureTreatmentId() {
        var key = "CAD_TREATMENT";
        var number = await _seq.GetNextValueAsync(key);

        return $"CADTR-{number.ToString().PadLeft(6, '0')}";
    }

    private async Task<string> GenerateCandidatureFormationId() {
        var key = "CAD_FORM";
        var number = await _seq.GetNextValueAsync(key);

        return $"CADFR-{number.ToString().PadLeft(6, '0')}";
    }

    private async Task<string> GenerateCandidaturePointId() {
        var key = "CAD_POINT";
        var number = await _seq.GetNextValueAsync(key);

        return $"CADPT-{number.ToString().PadLeft(6, '0')}";
    }

    private async Task<string> GenerateCandidatureCommentId() {
        var key = "CAD_COMM";
        var number = await _seq.GetNextValueAsync(key);

        return $"COM/CAD-{number.ToString().PadLeft(6, '0')}";
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

    public async Task AddCandidatureTreatmentAsync(CandidatureTreatment treatment) {
        treatment.Id = await GenerateCandidatureTreatmentId();
        await _dbCtx.CandidatureTreatments.AddAsync(treatment);
    }

    public async Task AddCandidatureFormationAsync(CandidatureFormation param) {
        param.Id = await GenerateCandidatureFormationId();
        await _dbCtx.CandidatureFormations.AddAsync(param);
    }

    public async Task AddCandidaturePointAsync(CandidaturePoint param) {
        param.Id = await GenerateCandidaturePointId();
        await _dbCtx.CandidaturePoints.AddAsync(param);
    }


    public async Task<LangageSpeaking?> GetLangageSpeakingByIdsAsync(string langageId, string levelId) {
        return await _dbCtx.LangagesSpeakings
        .Include(ls => ls.Langage)
        .Include(ls => ls.SpeakingLevel)
        .FirstOrDefaultAsync(ls =>
            ls.LangageId == langageId &&
            ls.SpeakingLevelId == levelId);
    }


    public async Task UpdateCriterionPoints(string candidatureId,
     string criterionId, decimal newPoints) {
        var candidature = await _dbCtx.Candidatures.FirstOrDefaultAsync(c => 
         c.Id.Equals(candidatureId))
         ?? throw new ArgumentException("Candidature non trouvée");

        var criterion = await _dbCtx.PreselectionCriterions.FirstOrDefaultAsync(p => 
         p.Id.Equals(criterionId))
         ?? throw new ArgumentException("Critère de présélection non trouvé");

        var canditatNote = await _dbCtx.CandidaturePoints.FirstOrDefaultAsync(cn =>
         cn.CandidatureId==candidatureId && cn.CriterionId==criterionId)
         ?? throw new ArgumentException("Note de candidature non trouvé");

        canditatNote.Points = newPoints;
        
        await _dbCtx.SaveChangesAsync();
    }


    public async Task FinishCandidatureTreatment(string candidatureId) {
        var candidature = await _dbCtx.Candidatures.FirstOrDefaultAsync(c => 
         c.Id.Equals(candidatureId))
         ?? throw new ArgumentException("Candidature non trouvée");

        candidature.IsTreated = true;

        await _dbCtx.SaveChangesAsync();
    }


    public async Task<Candidature?> GetCandidatureById(string id) {
        return await _dbCtx.Candidatures
            .Include(c => c.JobDescription)
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

                LevelEducationPoints = c.CandidatureDetails
                    .Select(cd => cd.LevelEducation.Points)
                    .FirstOrDefault(),

                LangagesSkills = c.CandidatureDetails
                    .Select(cd => cd.CandidatureTreatments.Select(ct => new LangageSkillDTO
                    {
                        Langage = ct.LangageSpeaking.Langage.Name,
                        Level = ct.LangageSpeaking.SpeakingLevel.Name,
                        Points = ct.LangageSpeaking.Points
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
                IsTreated = x.c.IsTreated
            })
            .FirstOrDefaultAsync();
    }


    public async Task<List<CandidaturePoint>> GetCandidatPointsAsync(string id) {
        var points = await _dbCtx.CandidaturePoints.Where(c => c.CandidatureId == id)
            .AsNoTracking().ToListAsync();
        
        return points;
    }


    public async Task AssignCandidaturePointsAsync(string candidatureId) {
        try {
            var candidature = await _dbCtx.Candidatures
                .Where(c => c.Id == candidatureId)
                .Select(c => new {
                    c.Id,
                    LevelPoints = c.CandidatureDetails
                        .Select(cd => cd.LevelEducation.Points)
                        .FirstOrDefault(),
                    Years = c.CandidatureDetails
                        .Select(cd => cd.YearsOfExperience)
                        .FirstOrDefault(),
                    LangPoints = c.CandidatureDetails
                        .SelectMany(cd => cd.CandidatureTreatments)
                        .Select(ct => ct.LangageSpeaking.Points)
                        .ToList(),
                })
                .FirstOrDefaultAsync()
                 ?? throw new ArgumentException("Candidature introuvable");

        // 1. Niveau d’étude
            decimal educationPoints = candidature.LevelPoints;
        // 2. Expérience
            decimal experiencePoints = await _dbCtx.ExperiencePoints
                .Where(ep => ep.MinimumYear <= candidature.Years && ep.MaximumYear >= candidature.Years)
                .Select(ep => ep.Points)
                .FirstOrDefaultAsync();
        // 3. Langues
            decimal langPoints = candidature.LangPoints?.Sum() ?? 0;
        // 4. Formations (manuelle → 0 au départ)
            decimal formationPoints = 0;
        // 5. CV (manuel → 0 au départ)
            decimal cvPoints = 0;

            var points = new List<CandidaturePoint> {
                new() { Id = Guid.NewGuid().ToString(), CandidatureId = candidatureId, CriterionId = "CRIT_001", Points = educationPoints },
                new() { Id = Guid.NewGuid().ToString(), CandidatureId = candidatureId, CriterionId = "CRIT_002", Points = formationPoints },
                new() { Id = Guid.NewGuid().ToString(), CandidatureId = candidatureId, CriterionId = "CRIT_003", Points = experiencePoints },
                new() { Id = Guid.NewGuid().ToString(), CandidatureId = candidatureId, CriterionId = "CRIT_004", Points = langPoints },
                new() { Id = Guid.NewGuid().ToString(), CandidatureId = candidatureId, CriterionId = "CRIT_005", Points = cvPoints }
            };

            await _dbCtx.CandidaturePoints.AddRangeAsync(points);
        }
        catch (Exception) {
           throw;
        }
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
        string id,
        int page,
        int pageSize)
    {
        var query = _dbCtx.CandidatureComments
            .Include(c => c.User)
            .Where(c => !c.IsDeleted && c.CandidatureId == id);

        var totalCount = await query.CountAsync();

        var list = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PaginatedResult<CandidatureComment>
        {
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
