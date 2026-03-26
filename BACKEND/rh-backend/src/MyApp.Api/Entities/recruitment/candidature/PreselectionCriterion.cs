using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Api.Entities.recruitment;

[Table("preselection_criterion")]
public class PreselectionCriterion : BaseEntity
{
    [Key]
    [Column("preselection_criterion_id")]
    public string Id { get; set; } = null!;

    [Column("criterion")]
    public string Criterion { get; set; } = null!;

    [Column("coefficient")]
    public decimal Coefficient { get; set; } = 1m;
}
