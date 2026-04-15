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

public class DocumentDTO
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
}

public class PlaningDTO
{
    public string Id { get; set; } = null!;
    public string CandidatureId { get; set; } = null!;
    public string ValidatorId { get; set; } = null!;
    public DateTime? DateTime { get; set; }
    public DocumentDTO Validator { get; set; } = null!;
    public DocumentDTO Candidature { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class UpdateDateTimeDTO
{
    [Required(ErrorMessage = "La date et heure sont obligatoires")]
    public DateTime DateTime { get; set; }
}
