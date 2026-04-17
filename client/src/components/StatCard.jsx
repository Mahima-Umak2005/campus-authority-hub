const StatCard = ({ title, value, color = "#2563eb" }) => {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        borderLeft: `6px solid ${color}`,
      }}
    >
      <h4 style={{ margin: 0, color: "#6b7280" }}>{title}</h4>
      <p style={{ fontSize: "28px", fontWeight: "bold", margin: "10px 0 0" }}>
        {value}
      </p>
    </div>
  );
};

export default StatCard;