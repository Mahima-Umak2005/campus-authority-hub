import PosterCard from "./PosterCard";

const PosterList = ({ posters }) => {
  if (!posters.length) return <p>No posters available</p>;

  return (
    <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
      {posters.map((poster) => (
        <PosterCard key={poster._id} poster={poster} />
      ))}
    </div>
  );
};

export default PosterList;