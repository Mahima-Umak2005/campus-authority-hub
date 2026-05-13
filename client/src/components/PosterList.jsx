import PosterCard from "./PosterCard";

const PosterList = ({ posters, showActions = true }) => {
  if (!posters.length) return <p className="text-gray-500 italic">No posters available</p>;

  return (
    <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
      {posters.map((poster) => (
        <PosterCard key={poster._id} poster={poster} showActions={showActions} />
      ))}
    </div>
  );
};

export default PosterList;
