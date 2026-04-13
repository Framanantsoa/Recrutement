const YearFilter: React.FC<{ 
    yearNow: number;
    year: number; 
    setYear: (y: number) => void 
}> = ({ yearNow, year, setYear }) => {

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 15 }}>
            <label style={{ fontWeight: 500 }}>Année :</label>

            <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #ddd",
                background: "white",
                fontWeight: 500,
                boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                }}
            >
                {[...Array(yearNow - 2026 + 1)].map((_, i) => {
                    const y = yearNow - i;
                    return (
                        <option key={y} value={y}>{y}</option>
                    );
                })}
            </select>
        </div>
    );
};

export default YearFilter;
