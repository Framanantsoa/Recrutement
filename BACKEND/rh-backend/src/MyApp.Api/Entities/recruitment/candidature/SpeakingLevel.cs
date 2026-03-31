using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Api.Entities.recruitment;

[Table("speaking_levels")]
public class SpeakingLevel : BaseEntity
{
    [Key]
    [Column("speaking_level_id")]
    public string Id { get; set; } = null!;

    [Column("speaking_level_code")]
    public string Code { get; set; } = null!;

    [Column("speaking_level_name")]
    public string Name { get; set; } = null!;
}
