using Hangfire.Common;
using Microsoft.EntityFrameworkCore;
using MyApp.Api.Data;
using MyApp.Api.Entities.recruitment;
using MyApp.Api.Models.dto.recruitment;
using MyApp.Api.Utils.generator;

namespace MyApp.Api.Repositories.recruitment;

public interface IJobDescriptionRepository
{
// Terme de référence
    Task AddJobDescription(JobDescription job);
    Task<JobDescription> GetJobDescriptionById(string id);
    Task<JobDescription?> GetByIdWithCriteria(string id);
    Task<JobDescriptionStatus> GetJobDescriptionStatusById(string statusId);
    Task<JobDescription?> GetJobDescriptionByRequest(RecruitmentRequest req);

    Task AddJobAttribution(Attribution param);
    Task AddFormation(Formation param);
    Task<List<Formation>> GetAllFormations();

    Task AddJobDescriptionSoftSkill(JobDescriptionSoftSkill job);

    Task AddSkill(Skill param);
    Task AddExperience(Experience param);
    Task AddValidation(JobDescriptionValidation validation);

    Task<LevelEducation> GetLevelEducationById(string id);
    Task<List<LevelEducation>> GetAllLevelEducations();
    Task<List<PostType>> GetAllPostTypes();
    void Attach<TEntity>(TEntity entity) where TEntity : class;
    Task<bool> SoftSkillExistsByLabel(string label);
    Task<bool> DoesExistsById(string id);
    Task UpdateJobDescription(JobDescription last, JobDescription newJob);

// Commit de transaction
    Task SaveChangesAsync();

    void RemoveAttributions(IEnumerable<Attribution> items);
    void RemoveFormations(IEnumerable<Formation> items);
    void RemoveExperiences(IEnumerable<Experience> items);
    void RemoveSoftSkills(IEnumerable<JobDescriptionSoftSkill> items);
    void RemoveSkills(IEnumerable<Skill> items);

// Liste des TDR en attente
    Task<(List<JobDescriptionDetailsDTO>, int)> GetAllPendedJobDescriptions(FilterRequestListDTO filters
     , int page, int pageSize);

// Présélection
    Task<decimal> GetMaxScoreAsync(string jobDescId);
}


public class JobDescriptionRepository(AppDbContext ctx, ISequenceGenerator seq) : IJobDescriptionRepository
{
    private readonly AppDbContext _dbCtx = ctx;
    private readonly ISequenceGenerator _seq = seq;


    public async Task<string> GenerateJobDescriptionId(string direction, int year) {
        var key = $"JOB_{direction}_{year}";
        var number = await _seq.GetNextValueAsync(key);

    // Ex : TDR/DRH/260001
        return $"TDR/{direction}/{year % 100}{number.ToString().PadLeft(4, '0')}";
    }


    public async Task<JobDescriptionStatus> GetJobDescriptionStatusById(string statusId) {
        return await _dbCtx.JobDescriptionStatuses.AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id==statusId) ??
            throw new ArgumentException("Statut de TDR introuvable");
    }


    public async Task<bool> SoftSkillExistsByLabel(string label) {
        return await _dbCtx.SoftSkills.AnyAsync(e => 
            e.Name.ToLower().Equals(label.ToLower())
        );
    }


    public async Task<bool> DoesExistsById(string id) {
        var exists = await _dbCtx.JobDescriptions
            .AnyAsync(j => j.Id == id);

        return exists;
    }


    public async Task AddJobDescription(JobDescription job) {
        var actualYear = DateTime.UtcNow.Year;

        job.Id = await this.GenerateJobDescriptionId(
            job.Request.HierarchicalManager.Department!, actualYear);
        await _dbCtx.JobDescriptions.AddAsync(job);
    }

    public async Task<JobDescription> GetJobDescriptionById(string id) {
        var result = await _dbCtx.JobDescriptions
            .Include(r => r.PostType)
            .Include(r => r.Attributions)
            .Include(r => r.Formations)
            .Include(r => r.Experiences)
            .Include(r => r.SoftSkills)
            .Include(r => r.Skills)
            .Include(r => r.Criteria)
            .Include(r => r.Request)
                .ThenInclude(req => req.HierarchicalManager)
            .FirstOrDefaultAsync(r => r.Id == id) ?? 
            throw new ArgumentException("Terme de référence introuvable");

        return result;
    }


    public async Task<decimal> GetMaxScoreAsync(string jobDescId) {
        var jobCriteria = await _dbCtx.JobDescriptionCriterias
            .Include(c => c.LevelEducations)
            .Include(c => c.Formations)
            .Include(c => c.Speakings)
            .Include(c => c.Presentations)
            .Include(c => c.Experiences)
            .Where(c => c.JobDescriptionId == jobDescId)
                .AsNoTracking()
                .ToListAsync();

        decimal totalMax = 0m;

        foreach (var c in jobCriteria) {
            totalMax += c.LevelEducations.Sum(le => le.Points);
            totalMax += c.Formations.Sum(f => f.Points);
            totalMax += c.Speakings.Sum(s => s.Points);
            totalMax += c.Presentations.Sum(p => p.Points);
            totalMax += c.Experiences.Sum(e => e.Points);
        }

        return totalMax;
    }


    public async Task<JobDescription?> GetByIdWithCriteria(string id) {
        return await _dbCtx.JobDescriptions
            .Include(j => j.Criteria)
                .ThenInclude(c => c.LevelEducations)
            .Include(j => j.Criteria)
                .ThenInclude(c => c.Experiences)
            .Include(j => j.Criteria)
                .ThenInclude(c => c.Speakings)             
                    .ThenInclude(s => s.LangageSpeaking)   
                        .ThenInclude(ls => ls.SpeakingLevel) 
            .FirstOrDefaultAsync(j => j.Id == id);
    }

    public async Task<JobDescription?> GetJobDescriptionByRequest(RecruitmentRequest req) {
        var result = await _dbCtx.JobDescriptions
            .Include(r => r.PostType)
            .Include(r => r.Attributions)
            .Include(r => r.Formations)
            .Include(r => r.Experiences)
            .Include(r => r.SoftSkills)
            .Include(r => r.Skills)
            .Include(r => r.Criteria)
                .ThenInclude(c => c.LevelEducations)
                    .ThenInclude(le => le.LevelEducation)
            .Include(r => r.Criteria)
                .ThenInclude(c => c.Experiences)
            .Include(r => r.Criteria)
                .ThenInclude(c => c.Speakings)
                    .ThenInclude(s => s.LangageSpeaking)
                        .ThenInclude(ls => ls.Langage)
            .Include(r => r.Criteria)
                .ThenInclude(c => c.Speakings)
                    .ThenInclude(s => s.LangageSpeaking)
                        .ThenInclude(ls => ls.SpeakingLevel)
            .FirstOrDefaultAsync(j => j.Request.Id == req.Id);

        return result;
    }


    public async Task AddFormation(Formation param) {
        param.Id = _seq.GenerateSequence("seq_job_formation_id", "FRT");
        await _dbCtx.Formations.AddAsync(param);
    }

    public async Task AddJobDescriptionSoftSkill(JobDescriptionSoftSkill job) {
        job.Id = _seq.GenerateSequence("seq_job_soft_skill_id", "FCH_QUA");
        await _dbCtx.JobDescriptionSoftSkills.AddAsync(job);
    }

    public async Task<List<Formation>> GetAllFormations() {
        return await _dbCtx.Formations.AsNoTracking().ToListAsync();
    }


    public async Task<List<PostType>> GetAllPostTypes() {
        return await _dbCtx.PostTypes.AsNoTracking().ToListAsync();
    }

    public async Task AddJobAttribution(Attribution param) {
        param.Id = _seq.GenerateSequence("seq_job_attribution_id", "FCH_ATT");
        await _dbCtx.Attributions.AddAsync(param);
    }

    public async Task AddExperience(Experience param) {
        param.Id = _seq.GenerateSequence("seq_job_experience_id", "EXP");
        await _dbCtx.Experiences.AddAsync(param);
    }

    public async Task AddSkill(Skill param) {
        param.Id = _seq.GenerateSequence("seq_skill_id", "CMC");
        await _dbCtx.Skills.AddAsync(param);
    }


    public async Task AddValidation(JobDescriptionValidation validation) {
        validation.Id = _seq.GenerateSequence("seq_job_validation_id", "VAL_TDR");
        await _dbCtx.JobDescriptionValidations.AddAsync(validation);
    }


    public async Task<LevelEducation> GetLevelEducationById(string id) {
        var result = await _dbCtx.LevelEducations.FindAsync(id) 
         ?? throw new ArgumentException("Niveau d'étude introuvable");

        return result;
    }

    public async Task<List<LevelEducation>> GetAllLevelEducations() {
        return await _dbCtx.LevelEducations.AsNoTracking().ToListAsync();
    }


    public async Task<SoftSkill> GetSoftSkillById(string id) {
        var result = await _dbCtx.SoftSkills.FindAsync(id) 
         ?? throw new ArgumentException("Qualité personnelle introuvable");

        return result;
    }

    public async Task<List<SoftSkill>> GetAllSoftSkills() {
        return await _dbCtx.SoftSkills.AsNoTracking().ToListAsync();
    }

    public async Task SaveChangesAsync() => await _dbCtx.SaveChangesAsync();

    public void Attach<TEntity>(TEntity entity) where TEntity : class {
        _dbCtx.Attach(entity);
    }


    public void RemoveAttributions(IEnumerable<Attribution> items) {
        if (items == null || !items.Any()) return;
        _dbCtx.Attributions.RemoveRange(items);
    }

    public void RemoveFormations(IEnumerable<Formation> items) {
        if (items == null || !items.Any()) return;
        _dbCtx.Formations.RemoveRange(items);
    }

    public void RemoveExperiences(IEnumerable<Experience> items) {
        if (items == null || !items.Any()) return;
        _dbCtx.Experiences.RemoveRange(items);
    }

    public void RemoveSoftSkills(IEnumerable<JobDescriptionSoftSkill> items) {
        if (items == null || !items.Any()) return;
        _dbCtx.JobDescriptionSoftSkills.RemoveRange(items);
    }

    public void RemoveSkills(IEnumerable<Skill> items) {
        if (items == null || !items.Any()) return;
        _dbCtx.Skills.RemoveRange(items);
    }


    public async Task UpdateJobDescription(JobDescription last, JobDescription newJob) {
        last.Mission = newJob.Mission;
        last.Attributions = newJob.Attributions;
        last.Experiences = newJob.Experiences;
        last.Formations = newJob.Formations;
        last.Skills = newJob.Skills;
        last.SoftSkills = newJob.SoftSkills;
        last.RequestId = newJob.RequestId;
        last.PostTypeId = newJob.PostTypeId;

        await SaveChangesAsync();
    }


    public async Task<(List<JobDescriptionDetailsDTO>, int)> GetAllPendedJobDescriptions(
        FilterRequestListDTO filters, int page, int pageSize
    ) {
        var query = _dbCtx.JobDescriptions.AsNoTracking()
            .Include(jd => jd.Request).ThenInclude(r => r.Creator)
            .Include(jd => jd.Request).ThenInclude(r => r.ApplicantUser)
            .Where(jd => jd.LastStatus.ToLower() == "en attente");

        // 🔍 Filtres
        if (!string.IsNullOrWhiteSpace(filters.post))
            query = query.Where(jd =>
                jd.Request.Post.ToUpper().Contains(filters.post.ToUpper()));

        if (!string.IsNullOrWhiteSpace(filters.direction))
            query = query.Where(jd =>
                jd.Request.Creator.Department != null &&
                jd.Request.Creator.Department.ToUpper() == filters.direction.ToUpper());

        if (filters.minDate.HasValue)
            query = query.Where(jd =>
                jd.Request.CreatedAt >= filters.minDate.Value
                    .ToDateTime(TimeOnly.MinValue));

        if (filters.maxDate.HasValue)
            query = query.Where(jd =>
                jd.Request.CreatedAt <= filters.maxDate.Value
                    .ToDateTime(TimeOnly.MaxValue));

        // Count avant pagination
        int totalCount = await query.CountAsync();

        // Pagination + projection DTO
        var items = await query
            .OrderByDescending(jd => jd.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(jd => new JobDescriptionDetailsDTO {
                Id = jd.Id,
                RequestId = jd.RequestId,
                Post = jd.Request.Post,
                Direction = jd.Request.Creator.Department ?? "",
                ApplicantUser = jd.Request.ApplicantUser.Name ?? "",
                Creator = jd.Request.Creator.Name ?? "",
                CreatedAt = jd.Request.CreatedAt,
                LastStatus = jd.LastStatus,
                Level = 0
            })
            .ToListAsync();

        return (items, totalCount);
    }
}
