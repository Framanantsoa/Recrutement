using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyApp.Api.Models.dto.recruitment;
using MyApp.Api.Services.recruitment;

namespace MyApp.Api.Controllers.recruitment;

[ApiController]
[Route("api/recruitment/[controller]s")]
public class PreselectionController
(IPreselectionService _service)  : ControllerBase
{
    [HttpGet("langages")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllLangages() {
        // if(!User.Identity?.IsAuthenticated ?? true) {
        //     return Unauthorized(new { data = (object?)null, status = 401, message = "unauthorized" });
        // }

        try {
            var results = await _service.GetAllLangagesAsync();
            return Ok(new { data = results, status = 200, message = "success" });
        }
        catch (ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch (Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpGet("speaking-levels")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllSpeakingLevels() {
        // if(!User.Identity?.IsAuthenticated ?? true) {
        //     return Unauthorized(new { data = (object?)null, status = 401, message = "unauthorized" });
        // }

        try {
            var results = await _service.GetAllSpeakingLevelsAsync();
            return Ok(new { data = results, status = 200, message = "success" });
        }
        catch (ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch (Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpGet("criterions")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllCriterions() {
        // if(!User.Identity?.IsAuthenticated ?? true) {
        //     return Unauthorized(new { data = (object?)null, status = 401, message = "unauthorized" });
        // }

        try {
            var results = await _service.GetAllPreselectionCriterionAsync();
            return Ok(new { data = results, status = 200, message = "success" });
        }
        catch (ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch (Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }


    [HttpPut("criterions/{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> UpdateCriterionCoefficient(string id,
     [FromBody] UpdateCriterionCoefficientDTO dto) {
        // if(!User.Identity?.IsAuthenticated ?? true) {
        //     return Unauthorized(new { data = (object?)null, status = 401, message = "unauthorized" });
        // }

        try {
            var result = await _service.UpdateCriterionCoefficientAsync(id, dto.Coefficient);
            return Ok(new { data = result, status = 200, message = "success" });
        }
        catch (ArgumentException ex) {
            return BadRequest(new { data = (object?)null, status = 400, message = ex.Message });
        }
        catch (Exception ex) {
            return StatusCode(500, new { data = (object?)null, status = 500, message = ex.Message });
        }
    }
}
