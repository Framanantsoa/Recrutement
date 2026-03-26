using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Api.Entities.recruitment;

[Table("experiences_points")]
public class ExperiencePoints
{
    [Key]
    [Column("experience_point_id")]
    public string Id { get; set; } = null!;

    [Column("minimum_year")]
    public short MinimumYear { get; set; }

    [Column("maximum_year")]
    public short MaximumYear { get; set; }

    [Column("points")]
    public decimal Points { get; set; }
}
