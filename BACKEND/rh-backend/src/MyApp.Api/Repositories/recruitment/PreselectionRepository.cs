using Microsoft.EntityFrameworkCore;
using MyApp.Api.Data;
using MyApp.Api.Entities.recruitment;
using MyApp.Api.Utils.generator;

namespace MyApp.Api.Repositories.recruitment;

public interface IPreselectionRepository
{
    Task<List<Langage>> GetAllLangagesAsync();
    Task<List<LangageSpeaking>> GetLangageSpeakings(List<string> langageIds, List<string> levelIds);
    Task<List<SpeakingLevel>> GetAllSpeakingLevelsAsync();
    Task<List<PreselectionCriteria>> GetAllPreselectionCriteriaAsync();

    Task AddPreselectionCriteria(PreselectionCriteria data);
    Task AddJobPreselectionCriteria(JobDescriptionCriteria data);

    Task AddLevelEducation(JobCriteriaLevelEducation data);
    Task AddFormation(JobCriteriaFormation data);
    Task AddExperience(JobCriteriaExperience data);
    Task AddSpeaking(JobCriteriaSpeaking data);
    Task AddPresentation(JobCriteriaPresentation data);

    Task AddLevelEducationRange(List<JobCriteriaLevelEducation> level);
    Task AddExperienceRange(List<JobCriteriaExperience> data);
    Task AddSpeakingRange(List<JobCriteriaSpeaking> data);
}


public class PreselectionRepository(
    AppDbContext context, ISequenceGenerator seq
) : IPreselectionRepository {

    private readonly AppDbContext _dbCtx = context;
    private readonly ISequenceGenerator _seq = seq;

    public async Task<List<Langage>> GetAllLangagesAsync() {
        return await _dbCtx.Langages.AsNoTracking().ToListAsync();
    }

    public async Task<List<SpeakingLevel>> GetAllSpeakingLevelsAsync() {
        return await _dbCtx.SpeakingLevels.AsNoTracking().ToListAsync();
    }

    public async Task<List<PreselectionCriteria>> GetAllPreselectionCriteriaAsync() {
        return await _dbCtx.PreselectionCriterias.AsNoTracking().ToListAsync();
    }

    public async Task<List<LangageSpeaking>> GetLangageSpeakings(
        List<string> langageIds, List<string> levelIds)
    {
        var result = await _dbCtx.LangagesSpeakings
            .Include(l => l.Langage)
            .Include(l => l.SpeakingLevel)
            .Where(l =>
                langageIds.Contains(l.LangageId) &&
                levelIds.Contains(l.SpeakingLevelId!)
            )
            .ToListAsync();

        if (!result.Any())
            throw new ArgumentException("Aucun niveau de langue trouvé");

        return result;
    }

    // INSERTS
    public async Task AddPreselectionCriteria(PreselectionCriteria data) {
        data.Id = await _seq.GenerateObjectId("PRESEL", "CRIT/PRE");
        await _dbCtx.PreselectionCriterias.AddAsync(data);
    }

    public async Task AddJobPreselectionCriteria(JobDescriptionCriteria data) {
        data.Id = await _seq.GenerateObjectId("JOB_CRIT", "TDR/CRIT");
        await _dbCtx.JobDescriptionCriterias.AddAsync(data);
    }

    public async Task AddLevelEducation(JobCriteriaLevelEducation data) {
        data.Id = await _seq.GenerateObjectId("JC_LE", "CRIT/LE");
        
        await _dbCtx.JobCriteriaLevelEducations.AddAsync(data);
    }

    public async Task AddExperience(JobCriteriaExperience data) {
        data.Id = await _seq.GenerateObjectId("JC_EXP", "CRIT/EXP");
        await _dbCtx.JobCriteriaExperiences.AddAsync(data);
    }

    public async Task AddSpeaking(JobCriteriaSpeaking data) {
        data.Id = await _seq.GenerateObjectId("JC_LANG", "CRIT/LANG");
        await _dbCtx.JobCriteriaSpeakings.AddAsync(data);
    }

    public async Task AddLevelEducationRange(List<JobCriteriaLevelEducation> data) {
        foreach (var item in data)
        {
            item.Id = await _seq.GenerateObjectId("JC_LE", "CRIT/LE");   
        }

        await _dbCtx.JobCriteriaLevelEducations.AddRangeAsync(data);
    }

    public async Task AddFormation(JobCriteriaFormation data) {
        data.Id = await _seq.GenerateObjectId("JC_FORM", "CRIT/FORM");
        await _dbCtx.JobCriteriaFormations.AddAsync(data);
    }

    public async Task AddPresentation(JobCriteriaPresentation data) {
        data.Id = await _seq.GenerateObjectId("JC_PRE", "CRIT/PRES");
        await _dbCtx.JobCriteriaPresentations.AddAsync(data);
    }

    public async Task AddExperienceRange(List<JobCriteriaExperience> data) {
        foreach (var item in data) {
            item.Id = await _seq.GenerateObjectId("JC_EXP", "CRIT/EXP");
        }
            
        await _dbCtx.JobCriteriaExperiences.AddRangeAsync(data);
    }

    public async Task AddSpeakingRange(List<JobCriteriaSpeaking> data) {
        foreach (var item in data) {
            item.Id = await _seq.GenerateObjectId("JC_LANG", "CRIT/LANG");
        }

        await _dbCtx.JobCriteriaSpeakings.AddRangeAsync(data);
    }
}
