import { useEffect, useState } from "react";

const PosterSlideshow = ({ posters }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!posters.length) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % posters.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [posters]);

  if (!posters.length) return <div className="text-white text-xl">No active posters</div>;

  const poster = posters[index];

  return (
    <div className="w-screen h-screen bg-[#111] flex justify-center items-center">
      <img
        src={poster.imageUrl}
        alt={poster.title}
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
};

export default PosterSlideshow;