import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { ShopContext } from "../context/ShopContext";
import CountUp from "./CountUp";
import SpotlightCard from "./SpotlightCard";
import InfiniteScroll from "./InfiniteScroll";
import axios from "axios";
import Squares from "./Squares";

const Glimpse = () => {
  const { navigate, backendUrl } = useContext(ShopContext);
  const [glimpses, setGlimpses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Prevent re-fetching data if already loaded
  const hasLoadedOnce = useRef(false);
  const glimpsesCache = useRef([]);

  useEffect(() => {
    const fetchGlimpses = async () => {
      // If we already have data and loaded once, don't fetch again
      if (hasLoadedOnce.current && glimpsesCache.current.length > 0) {
        setGlimpses(glimpsesCache.current);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Use the backendUrl from context instead of hardcoded localhost
        const response = await axios.get(`${backendUrl}/api/glimpses/list`);
        
        if (response.data.success) {
          const fetchedGlimpses = response.data.data || [];
          setGlimpses(fetchedGlimpses);
          glimpsesCache.current = fetchedGlimpses; // Cache the data
          hasLoadedOnce.current = true;
        } else {
          setError("Failed to fetch glimpses");
        }
      } catch (error) {
        console.error("Error fetching glimpses:", error);
        setError("Error fetching glimpses: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    if (backendUrl && !hasLoadedOnce.current) {
      fetchGlimpses();
    } else if (hasLoadedOnce.current) {
      // Use cached data
      setGlimpses(glimpsesCache.current);
      setLoading(false);
    }
  }, [backendUrl]);

  // Memoize default items to prevent recreation on every render
  const defaultItems = useMemo(() => [
    { content: <img className="border-2 border-white rounded-[15px]" src={assets.glimpse1} alt="" key="default-1" /> },
    // Add other default items here with stable keys
  ], []);

  // Memoize glimpse items to prevent recreation
  const glimpseItems = useMemo(() => {
    return glimpses.map((glimpse) => ({
      content: (
        <img 
          className="border-2 border-black rounded-[15px]" 
          src={glimpse.image} 
          alt="Glimpse" 
          key={glimpse._id}
        />
      )
    }));
  }, [glimpses]);

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
            {/* Background Squares - POSITIONED WITH LOWER Z-INDEX */}
            <div className="absolute inset-0 z-0">
              <Squares 
                key="squares-bg" // Stable key to prevent re-mounting
                speed={0.5} 
                squareSize={40}
                direction='diagonal' 
                borderColor='#fff'
                hoverFillColor='#222'
              />
            </div>
            
            {/* InfiniteScroll - POSITIONED WITH HIGHER Z-INDEX */}
            <div className="relative z-20 w-full h-full">
              <InfiniteScroll
                key="infinite-scroll" // Stable key to prevent re-mounting
                items={items}
                isTilted={true}
                tiltDirection="left"
                autoplay={true}
                autoplaySpeed={1}
                autoplayDirection="down"
                pauseOnHover={true}
              />
            </div>
            
            {/* Gradient Overlays */}
            <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-black to-transparent z-30 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black to-transparent z-30 pointer-events-none"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Glimpse;