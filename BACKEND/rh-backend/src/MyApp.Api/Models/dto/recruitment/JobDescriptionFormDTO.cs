using System.ComponentModel.DataAnnotations;

namespace MyApp.Api.Models.dto.recruitment
{
    public class JobDescriptionFormDTO
    {
    // Infos générales
        [Required(ErrorMessage = "Demande de recrutement obligatoire")]
        public string RequestId { get; set; } = null!;

        [Required(ErrorMessage = "Mission obligatoire")]
        public string Mission { get; set; } = null!;

        [Required(ErrorMessage = "Les attributions sont obligatoires.")]
        [MinLength(1, ErrorMessage = "Au moins une attribution est requise.")]
        public string[] Attributions { get; set; } = null!;

    // Formations et expériences
        [Required(ErrorMessage = "Les formations sont obligatoires.")]
        [MinLength(1)]
        public string[] Formations { get; set; } = null!;

        [Required(ErrorMessage = "Les expériences sont obligatoires.")]
        [MinLength(1)]
        public ExperienceDTO[] Experiences { get; set; } = null!;

    // Qualités perso et compétences
        [Required(ErrorMessage = "Les qualités personnelles sont obligatoires.")]
        [MinLength(1)]
        public string[] SoftSkills { get; set; } = null!;

        [Required(ErrorMessage = "Les compétences sont obligatoires.")]
        [MinLength(1, ErrorMessage = "Au moins une compétence est requise.")]
        public string[] Skills { get; set; } = null!;

    // Créateur de TDR
        public string CreatorId { get; set; } = null!;

    // Type de poste
        public string PostTypeId { get; set; } = null!;
    }


    public class JobDescriptionEditDTO
    {
        public string Id { get; set; } = null!;
    // Infos générales
        public string RequestId { get; set; } = null!;
        public string Mission { get; set; } = null!;
        public string[] Attributions { get; set; } = null!;

    // Formations et expériences
        public string[] Formations { get; set; } = null!;
        public ExperienceDTO[] Experiences { get; set; } = null!;

    // Qualités perso et compétences
        public string[] SoftSkills { get; set; } = null!;
        public string[] Skills { get; set; } = null!;

        public string PostTypeId { get; set; } = null!;
    }


    public class ExperienceDTO
    {
        [Required]
        public string Post { get; set; } = null!;

        [Required]
        public short Years { get; set; }
    }
}
