using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Api.Entities.recruitment;

[Table("business_sequences")]
public class BusinessSequence
{
    [Key]
    [Column("sequence_key")]
    public string Key { get; set; } = null!;

    
    [Column("current_value")]
    public int CurrentValue { get; set; }
    

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }
}
