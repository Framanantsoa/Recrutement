using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyApp.Api.Services.recruitment;

namespace MyApp.Api.Controllers.recruitment;

[ApiController]
[Route("api/recruitment/[controller]")]
public class DashboardController(IDashboardService s1) 
 : ControllerBase
{
    private readonly IDashboardService _dashboardService = s1;

    [HttpGet("stats/{direction}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetGlobalStats([FromRoute] string direction) {
        // if(!User.Identity?.IsAuthenticated ?? true) {
        //     return Unauthorized(new { data = (object?)null, status = 401, message = "unauthorized" });
        // }

        try {
            var stats = await _dashboardService.GetDashboardStatsAsync(direction);

            return Ok(new { data = stats, status = 200, message = "Statistiques récupérées avec succès" });
        }
        catch(ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch(Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpGet("requests-per-direction")]
    [AllowAnonymous]
    public async Task<IActionResult> GetRequestsPerDirection() {
        // if(!User.Identity?.IsAuthenticated ?? true) {
        //     return Unauthorized(new { data = (object?)null, status = 401, message = "unauthorized" });
        // }

        try {
            var stats = await _dashboardService.GetRequestsPerDirectionAsync();

            return Ok(new { data = stats, status = 200, message = "Demandes par direction récupérées avec succès" });
        }
        catch(ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch(Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpGet("requests-per-status/{direction}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetRequestsPerStatus([FromRoute] string direction) {
        // if(!User.Identity?.IsAuthenticated ?? true) {
        //     return Unauthorized(new { data = (object?)null, status = 401, message = "unauthorized" });
        // }

        try {
            var stats = await _dashboardService.GetRequestsPerStatusAsync(direction);

            return Ok(new { data = stats, status = 200, message = "Demandes par statut récupérées avec succès" });
        }
        catch(ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch(Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpGet("candidatures-per-month/{direction}/{year}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCandidaturesPerMonth([FromRoute] string direction,
     [FromRoute] int year) {
        // if(!User.Identity?.IsAuthenticated ?? true) {
        //     return Unauthorized(new { data = (object?)null, status = 401, message = "unauthorized" });
        // }

        try {
            var stats = await _dashboardService.GetCandidaturesPerMonthAsync(direction, year);

            return Ok(new { data = stats, status = 200, message = "Candidatures par mois récupérées avec succès" });
        }
        catch(ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch(Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }
}
