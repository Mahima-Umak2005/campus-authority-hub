import { useEffect, useState } from "react";
import PosterSlideshow from "../components/PosterSlideshow";
import { getActivePostersApi } from "../api/posters";

const DisplayScreen = () => {
  const [posters, setPosters] = useState([]);

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await getActivePostersApi(
          "students",
          "computer",
          token
        );

        setPosters(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPosters();
  }, []);

  return <PosterSlideshow posters={posters} />;
};

export default DisplayScreen;