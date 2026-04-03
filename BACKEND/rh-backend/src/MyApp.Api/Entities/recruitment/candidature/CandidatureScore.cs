using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Api.Entities.recruitment;

[Table("candidatures_scores")]
public class CandidatureScore
{
    [Key]
    [Column("candidature_score_id")]
    public string Id { get; set; } = null!;

    [Column("candidature_id")]
    public string CandidatureId { get; set; } = null!;

    [Column("job_criteria_id")]
    public string CriteriaId { get; set; } = null!;

    [Column("points")]
    public decimal Points { get; set; }

// RELATIONS
    [ForeignKey(nameof(CandidatureId))]
    public Candidature Candidature { get; set; } = null!;

    [ForeignKey(nameof(CriteriaId))]
    public JobDescriptionCriteria Criteria { get; set; } = null!;
}
