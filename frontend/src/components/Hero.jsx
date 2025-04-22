import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { ShopContext } from "../context/ShopContext";
import LiquidChrome from "./LiquidChrome";
import ShinyText from "./ShinyText";

const Hero = () => {
  const { navigate } = useContext(ShopContext);
  const [videosLoaded, setVideosLoaded] = useState(0);
  const totalVideos = 4;
  const videoSources = [assets.rose, assets.famous, assets.galaxy, assets.UL];

  // Use a simpler approach to video loading
  const handleVideoLoaded = () => {
    setVideosLoaded(prevCount => {
      const newCount = prevCount + 1;
      console.log(`Video loaded. Total loaded: ${newCount}/${totalVideos}`);
      return newCount;
    });
  };

  // Debug logs for asset URLs
  useEffect(() => {
    console.log("Video sources:", {
      rose: assets.rose,
      famous: assets.famous, 
      galaxy: assets.galaxy,
      UL: assets.UL
    });
  }, []);

  return (
    <div className="w-full h-[50vh] relative rounded-2xl overflow-hidden">
      <LiquidChrome baseColor={[0.1, 0.1, 0.1]} speed={0.3} amplitude={0.4} interactive={true} />
      <div className="absolute top-0 left-0 z-[1] w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8 px-4 sm:px-8 py-8">
          <div className="w-full flex items-center justify-center py-10 sm:py-0">
            <section>
              <div className="container mx-auto items-center">
                <div className="text-center absolute -translate-x-1/2 left-1/2 top-1/2 sm:top-1/2 z-50 transform -translate-y-1/2">
                  <div className="inline-flex gap-2 items-center mb-3">
                    <p className="text-white text-4xl md:text-7xl font-extrabold tracking-widest drop-shadow-lg uppercase prata-regular">
                      MNAR{" "}
                      <span className="text-white font-medium prata-regular">
                        CLOTHING
                      </span>
                    </p>
                    <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-100 text-4xl"></p>
                  </div>

                  <p className="text-white mb-6 text-xs sm:text-2xl prata-regular tracking-wider">
                    Exclusive Clothes collection on Mnar Wear
                  </p>

                  <button
                    onClick={() => navigate("/collection")}
                    className="bg-black relative z-10 text-white hover:bg-opacity-80 px-6 py-3 rounded-full overflow-hidden font-bold"
                  >
                    <span className="relative z-20">
                      <ShinyText
                        text="TO THE CATALOG"
                        speed={3}
                        className="tracking-widest uppercase drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]"
                      />
                    </span>
                    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.3),transparent)] animate-shine"></div>
                  </button>
                </div>

                <div className="relative flex justify-center items-center w-full sm:w-full h-[40vh] bg-transparent rounded-2xl overflow-hidden">
                  {/* Mobile video */}
                  <video
                    className="w-full h-full object-contain mix-blend-screen pointer-events-none sm:block lg:hidden animate-float"
                    src={assets.galaxy}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onCanPlay={() => console.log("Mobile video can play")}
                  />

                  {/* Desktop videos */}
                  <div className="hidden lg:flex w-full h-full">
                    {videosLoaded === totalVideos ? (
                      // Videos are ready to display
                      videoSources.map((src, index) => (
                        <video
                          key={index}
                          className="min-w-[200px] max-w-[300px] mx-2 object-contain mix-blend-screen pointer-events-none animate-float"
                          src={src}
                          muted
                          loop
                          playsInline
                          autoPlay
                        />
                      ))
                    ) : (
                      // Loading state
                      <>
                        <div className="w-full h-full flex items-center justify-center">
                          <p className="text-white text-lg animate-pulse">
                            Loading visuals... {videosLoaded}/{totalVideos}
                          </p>
                        </div>
                        
                        {/* Hidden videos that preload content */}
                        {videoSources.map((src, index) => (
                          <video
                            key={index}
                            className="hidden"
                            src={src}
                            muted
                            preload="auto"
                            onLoadedData={handleVideoLoaded}
                            onError={(e) => console.error(`Video ${index} error:`, e)}
                          />
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;