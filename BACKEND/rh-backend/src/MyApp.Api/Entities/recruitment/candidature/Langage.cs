using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Api.Entities.recruitment;

[Table("langages")]
public class Langage : BaseEntity
{
    [Key]
    [Column("langage_id")]
    public string Id { get; set; } = null!;

    [Column("langage_name")]
    public string Name { get; set; } = null!;

    [Column("is_other_langage")]
    public bool IsOtherLangage { get; set; } = true;
}
