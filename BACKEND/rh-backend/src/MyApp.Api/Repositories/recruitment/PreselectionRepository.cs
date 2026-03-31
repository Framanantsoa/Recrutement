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
    Task<PreselectionCriteria> UpdateCriteriaCoefficientAsync(string id, decimal coeff);
    Task AddCriteriaThreshold(CriteriaThreshold data);
    Task AddSpeakingCriteriaThresholdRange(List<SpeakingCriteriaThreshold> data);
    Task AddJobPreselectionCriteria(JobDescriptionCriteria data);
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

    public async Task<PreselectionCriteria> UpdateCriteriaCoefficientAsync(string id, decimal coeff) {
        var criteria = await _dbCtx.PreselectionCriterias.FindAsync(id)
         ?? throw new ArgumentException($"Critère de présélection ID : {id} non trouvé.");
        
        criteria.Coefficient = coeff;
        criteria.UpdatedAt = DateTime.UtcNow;

        _dbCtx.PreselectionCriterias.Update(criteria);
        await _dbCtx.SaveChangesAsync();

        return criteria;
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

        if (result.Count == 0)
            throw new ArgumentException("Aucun niveau de langue trouvé");

        return result;
    }

    public async Task AddCriteriaThreshold(CriteriaThreshold data) {
        data.Id = await _seq.GenerateObjectId("CRIT_THR", "SEU/CRIT");
        await _dbCtx.CriteriaThresholds.AddAsync(data);
    }

    public async Task AddSpeakingCriteriaThresholdRange(List<SpeakingCriteriaThreshold> data) {
        foreach (var item in data)
        {
            item.Id = await _seq.GenerateObjectId("CRIT_LANG", "LANG/CRIT");
        }

        await _dbCtx.SpeakingCriteriaThresholds.AddRangeAsync(data);
    }

    public async Task AddJobPreselectionCriteria(JobDescriptionCriteria data) {
        data.Id = await _seq.GenerateObjectId("JOB_CRIT", "TDR/CRIT");
        await _dbCtx.JobDescriptionCriterias.AddAsync(data);
    }
}
