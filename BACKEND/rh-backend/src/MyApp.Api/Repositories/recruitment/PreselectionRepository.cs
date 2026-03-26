using Microsoft.EntityFrameworkCore;
using MyApp.Api.Data;
using MyApp.Api.Entities.recruitment;
using MyApp.Api.Utils.generator;

namespace MyApp.Api.Repositories.recruitment;

public interface IPreselectionRepository
{
    Task<List<Langage>> GetAllLangagesAsync();
    Task<List<SpeakingLevel>> GetAllSpeakingLevelsAsync();
    Task<List<PreselectionCriterion>> GetAllPreselectionCriterionAsync();
    Task<PreselectionCriterion> UpdateCriterionCoefficientAsync(string id, decimal coeff);
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

    public async Task<List<PreselectionCriterion>> GetAllPreselectionCriterionAsync() {
        return await _dbCtx.PreselectionCriterions.AsNoTracking().ToListAsync();
    }

    public async Task<PreselectionCriterion> UpdateCriterionCoefficientAsync(string id, decimal coeff) {
        var criterion = await _dbCtx.PreselectionCriterions.FindAsync(id);
        if (criterion == null) {
            throw new ArgumentException($"Critère de présélection ID : {id} non trouvé.");
        }

        criterion.Coefficient = coeff;
        criterion.UpdatedAt = DateTime.UtcNow;

        _dbCtx.PreselectionCriterions.Update(criterion);
        await _dbCtx.SaveChangesAsync();

        return criterion;
    }
}
