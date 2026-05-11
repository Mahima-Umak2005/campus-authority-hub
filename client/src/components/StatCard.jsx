const StatCard = ({ title, value, color = "#2563eb" }) => {
  return (
    <div
      className="bg-white rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
      style={{ borderLeft: `6px solid ${color}` }}
    >
      <h4 className="m-0 text-gray-500 font-medium">{title}</h4>
      <p className="text-[28px] font-bold m-[10px_0_0] text-gray-800">
        {value}
      </p>
    </div>
  );
};

export default StatCard;