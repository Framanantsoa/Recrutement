using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Api.Entities.recruitment;

[Table("candidatures_details")]
public class CandidatureDetail
{
    [Key]
    [Column("candidature_detail_id")]
    public string Id { get; set; } = null!;

    [Column("candidature_id")]
    public string CandidatureId { get; set; } = null!;

    [Column("level_education_id")]
    public string LevelEducationId { get; set; } = null!;

    [Column("years_of_experience")]
    public short YearsOfExperience { get; set; } = 0;
    

    [ForeignKey(nameof(CandidatureId))]
    public Candidature Candidature { get; set; } = null!;


    [ForeignKey(nameof(LevelEducationId))]
    public LevelEducation LevelEducation { get; set; } = null!;

// =============================
// Navigation properties
// ============================
    public ICollection<CandidatureTreatment> CandidatureTreatments { get; set; }
        = new List<CandidatureTreatment>();
}
