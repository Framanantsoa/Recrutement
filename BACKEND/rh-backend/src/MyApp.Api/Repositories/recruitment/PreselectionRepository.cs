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

    public async Task AddJobPreselectionCriteria(JobDescriptionCriteria data) {
        data.Id = await _seq.GenerateObjectId("JOB_CRIT", "TDR/CRIT");
        await _dbCtx.JobDescriptionCriterias.AddAsync(data);
    }
}
