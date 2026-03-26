using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Api.Entities.recruitment;

[Table("candidatures_points")]
public class CandidaturePoint
{
    [Key]
    [Column("candidature_point_id")]
    public string Id { get; set; } = null!;

    [Column("candidature_id")]
    public string CandidatureId { get; set; } = null!;

    [Column("preselection_criterion_id")]
    public string CriterionId { get; set; } = null!;

    [Column("points")]
    public decimal Points { get; set; }


// RELATIONS
    [ForeignKey(nameof(CandidatureId))]
    public Candidature Candidature { get; set; } = null!;

    [ForeignKey(nameof(CriterionId))]
    public PreselectionCriterion Criterion { get; set; } = null!;
}
