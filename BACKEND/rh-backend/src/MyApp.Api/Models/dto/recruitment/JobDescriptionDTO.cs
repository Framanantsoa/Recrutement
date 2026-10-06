using MyApp.Api.Entities.recruitment;

namespace MyApp.Api.Models.dto.recruitment;

public class JobDescriptionDTO
{
// Infos générales
    public string Id { get; set; } = null!;
    public string Post { get; set; } = null!;
    public string[] Sites { get; set; } = null!;
    public string RequestId { get; set; } = null!;
    public string Mission { get; set; } = null!;
    public string[] Attributions { get; set; } = null!;

    public string PostTypeName { get; set; } = null!;

// Date de création
    public DateTime CreatedAt { get; set; }

// Formations et expériences
    public string[] Formations { get; set; } = null!;
    public string[] Experiences { get; set; } = null!;

// Qualités perso et compétences
    public string[] SoftSkills { get; set; } = null!;
    public string[] Skills { get; set; } = null!;
    public string? LastTitular { get; set; }

// Statut
    public string LastStatus { get; set; } = null!;

// Criterias
    public JobCriteriaDTO Criteria { get; set; } = null!;
}


public class JobDescriptionCardDTO
{
    public string Id { get; set; } = null!;
    public string Post { get; set; } = null!;
    public string Direction { get; set; } = null!;
    public string ApplicantUser { get; set; } = null!;
    public string HierarchicalManager { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public string LastStatus { get; set; } = null!;
}

public class JobDescriptionFiltersDTO
{
    public string? Post { get; set; }
    public string? Direction { get; set; }
    public DateOnly? MinDate { get; set; }
    public DateOnly? MaxDate { get; set; }
}


public class JobDescriptionDetailsDTO
{
    public string Id { get; set; } = null!;
    public string RequestId { get; set; } = null!;
    public string Post { get; set; } = null!;
    public string Direction { get; set; } = null!;
    public string ApplicantUser { get; set; } = null!;
    public string Creator { get; set; } = null!;
    public int Level { get; set; }
    public DateTime CreatedAt { get; set; }
    public string LastStatus { get; set; } = null!;
}
