using MyApp.Api.Entities.recruitment;

namespace MyApp.Api.Models.dto.recruitment;

public class PreselectionCriteriaDTO
{
    public List<PreselectionCriteriaWithScoreDTO> Criteria { get; set; } = [];
    public decimal TotalScore { get; set; }
}

public class PreselectionCriteriaWithScoreDTO
{
    public string Id { get; set; } = null!;
    public string Criteria { get; set; } = null!;
    public decimal Coefficient { get; set; }
    public decimal Score { get; set; }
}


public class UpdateCriteriaCoefficientDTO
{
    public decimal Coefficient { get; set; }
}


public class LevelEducationCriteriaForm
{
    public string LevelId { get; set; } = null!;
    public decimal Points { get; set; }
}

public class ExperienceCriteriaForm
{
    public short Minimum { get; set; }
    public short Maximum { get; set; }
    public decimal Points { get; set; }
}

public class LangageSkillCriteriaForm
{
    public string LangageId { get; set; } = null!;
    public string LevelId { get; set; } = null!;
    public decimal Points { get; set; }
}

public class JobCriteriaFormDTO
{
    public string JobDescId { get; set; } = null!;
    public List<LevelEducationCriteriaForm> LevelEducation { get; set; } = null!;
    public List<ExperienceCriteriaForm> Experiences { get; set; } = [];
    public List<LangageSkillCriteriaForm> Langages { get; set; } = [];

    public decimal FormationsPoints { get; set; }
    public decimal PresentationsPoints { get; set; }
    public decimal ExperiencesPoints { get; set; }
    public decimal LangagesPoints { get; set; }
    public decimal LevelEducationsPoints { get; set; }
}

public class SpeakingCriteriaDTO
{
    public string Langage { get; set; } = null!;
    public string Level { get; set; } = null!;
}

// AFFICHAGE -> extraction
public class LevelEducationDataDTO
{
    public string LevelId { get; set; } = null!;
    public string LevelName { get; set; } = null!;
    public decimal Points { get; set; }
}

public class ExperienceDataDTO
{
    public short MinYear { get; set; }
    public short MaxYear { get; set; }
    public decimal Points { get; set; }
}

public class LangageDataDTO
{
    public string Langage { get; set; } = null!;
    public string Level { get; set; } = null!;
    public decimal Points { get; set; }
}

public class JobCriteriaDTO
{
    public decimal LevelEducationsPoints { get; set; }
    public List<LevelEducationDataDTO> LevelEducations { get; set; } = [];

    public decimal FormationsPoints { get; set; }

    public decimal PresentationsPoints { get; set; }

    public decimal ExperiencesPoints { get; set; }
    public List<ExperienceDataDTO> Experiences { get; set; } = [];

    public decimal LangagesPoints { get; set; }
    public List<LangageDataDTO> Langages { get; set; } = [];

    public decimal TotalScore { get; set; }
}
