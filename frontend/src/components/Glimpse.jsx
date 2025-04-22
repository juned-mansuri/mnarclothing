import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { ShopContext } from "../context/ShopContext";
import CountUp from "./CountUp";
import SpotlightCard from "./SpotlightCard";
import InfiniteScroll from "./InfiniteScroll";
import axios from "axios";

const Glimpse = () => {
  const { navigate } = useContext(ShopContext);
  const [glimpses, setGlimpses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGlimpses = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4000/api/glimpses/list");
        
        if (response.data.success) {
          setGlimpses(response.data.data || []);
        } else {
          setError("Failed to fetch glimpses");
        }
      } catch (error) {
        console.error("Error fetching glimpses:", error);
        setError("Error fetching glimpses: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGlimpses();
  }, []);

  // Fallback to default items if no glimpses are available
  const defaultItems = [
    { content: <img className="border-2 border-white rounded-[15px]" src={assets.glimpse1} alt="" /> },
    // ... other default items
  ];

  // Create items from fetched glimpses
  const glimpseItems = glimpses.map((glimpse) => ({
    content: (
      <img 
        className="border-2 border-white rounded-[15px]" 
        src={glimpse.image} 
        alt="Glimpse" 
        key={glimpse._id}
      />
    )
  }));

  // Use glimpseItems if available, otherwise fall back to default
  const items = glimpseItems.length > 0 ? glimpseItems : defaultItems;

  // Get the count of glimpses for the counter
  const glimpseCount = glimpses.length;

  return (
    <div className="w-full h-full bg-white [background-image:radial-gradient(rgba(12,12,12,0.171)_2px,transparent_0)] [background-size:30px_30px] [background-position:-5px_-5px]">
      <div className="w-full sm:w-3/4 md:w-full relative rounded-[20px] overflow-hidden mt-4 mb-4">
        <div className="w-full flex flex-row md:flex-row items-center justify-center gap-6 md:gap-12 text-center">
          {/* Left Text */}
          <div className="text-2xl sm:text-4xl md:text-6xl font-thin text-black prata-regular">
            Served
          </div>

          {/* Circular CountUp - Now using the actual glimpse count */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white flex items-center justify-center bg-black/30 shadow-inner">
            <SpotlightCard
              className="custom-spotlight-card text-center w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white flex items-center justify-center shadow-inner"
              spotlightColor="rgba(0, 229, 255, 0.2)"
            >
              {loading ? (
                <div className="text-2xl text-white font-bold">...</div>
              ) : (
                <CountUp
                  from={0}
                  to={glimpseCount}
                  separator=","
                  direction="up"
                  duration={1}
                  className="text-4xl sm:text-5xl md:text-6xl text-white font-extrabold"
                />
              )}
            </SpotlightCard>
          </div>

          {/* Right Text */}
          <div className="text-xl sm:text-2xl md:text-6xl font-semibold text-black prata-regular">
            Warm Meals
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading glimpses...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <div>
          <div
            style={{ height: "500px", position: "relative" }}
            className="relative rounded-3xl border border-neutral-800 bg-black mt-0 overflow-hidden text-white"
          >
            <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>
            <InfiniteScroll
              items={items}
              isTilted={true}
              tiltDirection="left"
              autoplay={true}
              autoplaySpeed={1}
              autoplayDirection="down"
              pauseOnHover={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Glimpse; 