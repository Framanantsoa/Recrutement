using Microsoft.EntityFrameworkCore;
using MyApp.Api.Data;
using MyApp.Api.Entities.recruitment;
using MyApp.Api.Entities.users;
using MyApp.Api.Utils.generator;

namespace MyApp.Api.Repositories.recruitment;

public interface IJobInterviewRepository
{
    Task AddPlaning(Planing plan);
    Task<Planing?> GetPlaningByIdAsync(string planId);
    Task AddJobInterview(JobInterview job);
    Task<JobInterview?> GetJobInterviewByIdAsync(string jobId);
    Task<RecruitmentRequest> GetRequestByPlaning(Planing plan);
    Task<List<Planing>> GetPlaningsByCandidature(string jobDescId);
    Task<List<Planing>> GetAllPlaningsToDoForUser(User user, int year, int month);
}

public class JobInterviewRepository(AppDbContext ctx, ISequenceGenerator seq)
 : IJobInterviewRepository
{
    private readonly AppDbContext _dbCtx = ctx;
    private readonly ISequenceGenerator _seqGenerator = seq;


    private async Task<string> GeneratePlaningId() {
        var key = "JOB_PLAN";
        var number = await _seqGenerator.GetNextValueAsync(key);

        return $"PLAN-{number.ToString().PadLeft(6, '0')}";
    }

    private async Task<string> GenerateJobInterviewId() {
        var key = "JOB_INT";
        var number = await _seqGenerator.GetNextValueAsync(key);

        return $"ENT/EMB-{number.ToString().PadLeft(6, '0')}";
    }


    public async Task AddPlaning(Planing plan) {
        var planId = await GeneratePlaningId();
        plan.Id = planId;

        await _dbCtx.Planings.AddAsync(plan);
    }

    public async Task<Planing?> GetPlaningByIdAsync(string planId) {
        var planification = await _dbCtx.Planings
            .Include(p => p.Candidature)
            .Include(p => p.Validator)
            .FirstOrDefaultAsync(p => p.Id == planId);
        
        return planification;
    }


    public async Task AddJobInterview(JobInterview job) {
        var jobInterviewId = await GenerateJobInterviewId();
        job.Id = jobInterviewId;

        await _dbCtx.JobInterviews.AddAsync(job);
    }

    public async Task<JobInterview?> GetJobInterviewByIdAsync(string jobId) {
        var jobInterview = await _dbCtx.JobInterviews
            .Include(j => j.Planing)
                .ThenInclude(p => p.Candidature)
                    .ThenInclude(c => c.JobDescription)
                        .ThenInclude(j => j.PostType)
            .FirstOrDefaultAsync(p => p.Id == jobId);
        
        return jobInterview;
    }


    public async Task<RecruitmentRequest> GetRequestByPlaning(Planing plan) {
        var request = await _dbCtx.Planings
            .Where(i => i.Id == plan.Id)
            .Include(p => p.Candidature)
                .ThenInclude(c => c.JobDescription)
                    .ThenInclude(j => j.Request)
            .Select(pl => pl.Candidature.JobDescription.Request)
            .FirstOrDefaultAsync();

        return request!;
    }


    public async Task<List<Planing>> GetPlaningsByCandidature(string candId) {
        return await _dbCtx.Planings.AsNoTracking()
            .Include(p => p.Candidature)
            .Where(p => p.CandidatureId==candId)
            .ToListAsync();
    }


    public async Task<List<Planing>> GetAllPlaningsToDoForUser(
        User user, int year, int month
    ) {
        var startDate = new DateTime(year, month, 1);
        var endDate = startDate.AddMonths(1);

        var planings = await _dbCtx.Planings
            .Include(p => p.Validator)
            .Where(p =>
                p.ValidatorId == user.UserId &&
                p.DateTime >= startDate && p.DateTime < endDate
            )
            .AsNoTracking()
            .ToListAsync();

        return planings;
    }
}
