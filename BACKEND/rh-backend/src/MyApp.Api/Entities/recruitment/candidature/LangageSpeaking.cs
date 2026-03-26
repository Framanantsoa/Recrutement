using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Api.Entities.recruitment;

[Table("langages_speakings")]
public class LangageSpeaking
{
    [Key]
    [Column("langage_speaking_id")]
    public string Id { get; set; } = null!;

    [Column("langage_id")]
    public string LangageId { get; set; } = null!;

    [Column("speaking_level_id")]
    public string? SpeakingLevelId { get; set; }

    [Column("points")]
    public decimal Points { get; set; }

    [ForeignKey(nameof(LangageId))]
    public Langage Langage { get; set; } = null!;

    [ForeignKey(nameof(SpeakingLevelId))]
    public SpeakingLevel SpeakingLevel { get; set; } = null!;
}
