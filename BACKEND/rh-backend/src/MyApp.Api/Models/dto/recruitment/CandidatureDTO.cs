using System.ComponentModel.DataAnnotations;
using MyApp.Api.Annotations;
using MyApp.Api.Entities.recruitment;

namespace MyApp.Api.Models.dto.recruitment;

public class CandidatureFiltersDTO
{
    public string? Name { get; set; }
    public bool? Treated { get; set; }
    public DateOnly? SendingMinDate { get; set; }
    public DateOnly? SendingMaxDate { get; set; }
    public bool? IsPreselected { get; set; }
}

public class CandidatureScoreDTO
{
    public string Id { get; set; } = null!;
    public string CriteriaId { get; set; } = null!;
    public string Criteria { get; set; } = null!;
    public decimal Points { get; set; }
    public decimal Max { get; set; }
}

public class CandidaturesDetailsDTO
{
    public string Contract { get; set; } = null!;
    public string Direction { get; set; } = null!;
    public string Post { get; set; } = null!;
}


public class CandidatureDetailsDTO
{
// Informations générales
    public string Id { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;

// Documents
    public string? LmUrl { get; set; }
    public string? CvUrl { get; set; }

// Informations supplementaires
    public string[] Formations { get; set; } = null!;
    public short YearsOfExperience { get; set; }
    public string LevelEducation { get; set; } = null!;

    public IEnumerable<LangageSkillDTO> LangagesSkills { get; set; }
     = new List<LangageSkillDTO>();

    public IEnumerable<CandidatureScoreDTO> Scores { get; set; } = [];

    public decimal TotalScore { get; set; }
    public decimal MaxScore { get; set; }
    
// Informations de traitement
    public DateTime SendingDateTime { get; set; }
    public bool IsTreated { get; set; }
    public DateTime? TreatedAt { get; set; }

    public bool? IsPreselected { get; set; }
}

public class CandidatureDTO
{
    public string Id { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? LmUrl { get; set; }
    public string? CvUrl { get; set; }
    public decimal MaxScore { get; set; }
    public decimal TotalScore { get; set; }
    public bool IsTreated { get; set; }
    public DateTime SendingDateTime { get; set; }
    public bool? IsPreselected { get; set; }
}


public class LangageSkillDTO
{
    public string Langage { get; set; } = null!;
    public string LevelCode { get; set; } = null!;
    public string Level { get; set; } = null!;
}

public class LangageSkillFormDTO
{
    public string LangageId { get; set; } = null!;
    public string LevelId { get; set; } = null!;
}

public class PaginatedResult<T>
{
    public List<T> List { get; set; } = new();
    public int TotalCount { get; set; }
}

public class CandidatureNoteUpdateFormDTO
{
    public string CriteriaId { get; set; } = null!;
    public decimal Points { get; set; }
}

public class CandidatureCommentFormDTO
{
    public string CommentatorId { get; set; } = null!;
    public string Comment { get; set; } = null!;
}

public class CandidatureFormDTO
{
    [Required(ErrorMessage = "Le prénom est obligatoire.")]
    [StringLength(100, ErrorMessage = "Le prénom ne doit pas dépasser 100 caractères.")]
    public string FirstName { get; set; } = null!;

    [Required(ErrorMessage = "Le nom est obligatoire.")]
    [StringLength(100, ErrorMessage = "Le nom ne doit pas dépasser 100 caractères.")]
    public string LastName { get; set; } = null!;

    [Required(ErrorMessage = "L'adresse email est obligatoire.")]
    [EmailAddress(ErrorMessage = "L'adresse email n'est pas valide.")]
    public string Email { get; set; } = null!;

    [Url(ErrorMessage = "L'URL de la lettre de motivation n'est pas valide.")]
    public string? LmUrl { get; set; }

    [Url(ErrorMessage = "L'URL du CV n'est pas valide.")]
    public string? CvUrl { get; set; }

// Traitement
    [Required(ErrorMessage = "Le niveau d'étude est obligatoire.")]
    [ExistsLevelEducation]
    public string LevelEducationId { get; set; } = null!;

    [Required(ErrorMessage = "Vous devez indiquer au moins une formation.")]
    [MinLength(1, ErrorMessage = "Vous devez indiquer au moins une formation.")]
    public string[] Formations { get; set; } = null!;

    [Range(0, short.MaxValue, ErrorMessage = "Les années d'expérience doivent être supérieures ou égales à 0.")]
    public short YearsOfExperience { get; set; }

    [Required(ErrorMessage = "Vous devez indiquer au moins une langue.")]
    [MinLength(1, ErrorMessage = "Vous devez indiquer au moins une langue.")]
    [ValidLangages]
    public LangageSkillFormDTO[] Langages { get; set; } = null!;
}
