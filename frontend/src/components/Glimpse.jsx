import React, { useContext } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { ShopContext } from "../context/ShopContext";
import CountUp from "./CountUp";
import SpotlightCard from "./SpotlightCard";
import InfiniteScroll from "./InfiniteScroll";

const Glimpse = () => {
  const { navigate } = useContext(ShopContext);
  const items = [
    { content: "Text Item 1" },
    { content: <p>Paragraph Item 2</p> },
    { content: "Text Item 3" },
    { content: <p>Paragraph Item 4</p> },
    { content: "Text Item 5" },
    { content: <p>Paragraph Item 6</p> },
    { content: "Text Item 7" },
    { content: <p>Paragraph Item 8</p> },
    { content: "Text Item 9" },
    { content: <p>Paragraph Item 10</p> },
    { content: "Text Item 11" },
    { content: <p>Paragraph Item 12</p> },
    { content: "Text Item 13" },
    { content: <p>Paragraph Item 14</p> },
  ];
  return (
    <div>
      <div className="w-full sm:w-3/4 md:w-full   relative rounded-[20px] overflow-hidden mt-4 mb-4">
        <div className="w-full flex flex-row md:flex-row items-center justify-center gap-6 md:gap-12 text-center">
          {/* Left Text */}
          <div className="text-2xl sm:text-4xl md:text-6xl font-thin text-black prata-regular">
            Served
          </div>

          {/* Circular CountUp */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white flex items-center justify-center bg-black/30 shadow-inner">
            <SpotlightCard
              className="custom-spotlight-card text-center w-32 h-32 sm:w-40 sm:h-40  rounded-full border-4 border-white flex items-center justify-center shadow-inner"
              spotlightColor="rgba(0, 229, 255, 0.2)"
            >
              <CountUp
                from={0}
                to={100}
                separator=","
                direction="up"
                duration={1}
                className="text-4xl sm:text-5xl md:text-6xl text-white font-extrabold"
              />
            </SpotlightCard>
          </div>

          {/* Right Text */}
          <div className="text-xl sm:text-2xl md:text-6xl font-semibold text-black prata-regular">
            Warm Meals
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default Glimpse;
