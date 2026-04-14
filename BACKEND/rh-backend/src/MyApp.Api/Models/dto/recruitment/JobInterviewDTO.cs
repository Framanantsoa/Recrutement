using System.ComponentModel.DataAnnotations;

namespace MyApp.Api.Models.dto.recruitment;

public class PlaningFormDTO
{
    [Required(ErrorMessage = "La candidature est obligatoire")]
    public string CandidatureId { get; set; } = null!;


    [Required(ErrorMessage = "La candidature est obligatoire")]
    public string ValidatorId { get; set; } = null!;


    [Required(ErrorMessage = "La date et heure sont obligatoires")]
    public DateTime? DateTime { get; set; }
}
