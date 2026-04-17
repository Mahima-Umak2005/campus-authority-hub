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

  if (!posters.length) return <div>No active posters</div>;

  const poster = posters[index];

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#111",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={poster.imageUrl}
        alt={poster.title}
        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
      />
    </div>
  );
};

export default PosterSlideshow;