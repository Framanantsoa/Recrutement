namespace MyApp.Api.Models.dto.recruitment;

// ===================================================
// STATISTIQUES GLOBALES
// ===================================================
public class DashboardStatsDTO 
{
    public int TotalRequests { get; set; }
    public int? AverageDay { get; set; }
    public int TreatedCandidatures { get; set; }
    public int PreselectedCandidatures { get; set; }
}


// ===================================================
// GRAPHES
// ===================================================
public class RequestPerDirectionDTO 
{
    public string Direction { get; set; } = null!;
    public int Count { get; set; }
}

public class RequestPerStatusDTO 
{
    public string Status { get; set; } = null!;
    public int Count { get; set; }
    public decimal Percentage { get; set; }
}

public class CandidaturePerMonthDTO 
{
    public int Year { get; set; }
    public int Month { get; set; }
    public int Count { get; set; }
}
