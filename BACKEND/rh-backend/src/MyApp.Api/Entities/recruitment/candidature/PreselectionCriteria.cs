using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Api.Entities.recruitment;

[Table("preselection_criteria")]
public class PreselectionCriteria : BaseEntity
{
    [Key]
    [Column("preselection_criteria_id")]
    public string Id { get; set; } = null!;

    [Column("criteria")]
    public string Criteria { get; set; } = null!;
}
