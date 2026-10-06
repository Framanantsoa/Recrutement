using Microsoft.EntityFrameworkCore;
using MyApp.Api.Data;
using MyApp.Api.Models.dto.recruitment;

namespace MyApp.Api.Repositories.recruitment;

public interface IDashboardRepository
{
    Task<DashboardStatsDTO> GetDashboardStatsAsync(string direction);
    Task<IEnumerable<RequestPerDirectionDTO>> GetRequestsPerDirectionAsync();
    Task<IEnumerable<RequestPerStatusDTO>> GetRequestsPerStatusAsync(string direction);
    Task<IEnumerable<CandidaturePerMonthDTO>> GetCandidaturesPerMonthAsync(
     string direction, int year);
}

public class DashboardRepository(AppDbContext context) : IDashboardRepository
{
    private readonly AppDbContext _dbCtx = context;


    public async Task<DashboardStatsDTO> GetDashboardStatsAsync(string direction) {
        var result = await _dbCtx.DashboardStats
            .FromSqlRaw(
                "SELECT * FROM dbo.GetRecruitmentStatsByDirection({0})",
                direction
            )
            .AsNoTracking()
            .FirstOrDefaultAsync();

        return result ?? new DashboardStatsDTO();
    }


    public async Task<IEnumerable<RequestPerDirectionDTO>> GetRequestsPerDirectionAsync() {
        var result = await _dbCtx.Directions
            .GroupJoin(
                _dbCtx.RecruitmentRequests.Where(r => !r.IsDeleted)
                    .Join(_dbCtx.Users,
                        r => r.HierarchicalManagerId,
                        u => u.UserId,
                        (r, u) => new { r, u }),
                d => d.Acronym,
                x => x.u.Department,
                (d, requests) => new RequestPerDirectionDTO
                {
                    Direction = d.Acronym ?? "N/A",
                    Count = requests.Count()
                }
            )
            .ToListAsync();

        return result;
    }


    public async Task<IEnumerable<RequestPerStatusDTO>> GetRequestsPerStatusAsync(string direction) {
        var statuses = await _dbCtx.RequestStatuses
            .Select(s => s.Name)
            .ToListAsync();

        var requests = await _dbCtx.RecruitmentRequests
            .Where(r => !r.IsDeleted)
            .Where(r => r.HierarchicalManager.Department == direction)
            .Select(r => r.LastStatus)
            .ToListAsync();

        var grouped = requests
            .GroupBy(x => x)
            .ToDictionary(g => g.Key, g => g.Count());

        var total = requests.Count;

        var result = statuses.Select(status => {
            grouped.TryGetValue(status, out var count);

            return new RequestPerStatusDTO {
                Status = status,
                Count = count,
                Percentage = total == 0 
                 ? 0 : Math.Round((decimal)count * 100 / total, 2)
            };
        });

        return result;
    }


    public async Task<IEnumerable<CandidaturePerMonthDTO>> GetCandidaturesPerMonthAsync(
     string direction, int year) {
        var data = await _dbCtx.Candidatures
            .Where(c => c.CreatedAt.Year == year)
            .Where(c => c.JobDescription.Request.HierarchicalManager.Department == direction)
            .Select(c => new {
                Month = c.CreatedAt.Month
            })
            .ToListAsync();

        var grouped = data
            .GroupBy(x => x.Month)
            .ToDictionary(g => g.Key, g => g.Count());

        var result = Enumerable.Range(1, 12)
            .Select(m => new CandidaturePerMonthDTO {
                Year = year,
                Month = m,
                Count = grouped.ContainsKey(m) ? grouped[m] : 0
            })
            .ToList();

        return result;
    }
}
