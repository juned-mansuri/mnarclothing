import React from "react";
import { Link } from "react-router-dom";
import TiltedCard from "./TiltedCard";
import { assets } from "../assets/frontend_assets/assets";

const GenderCategories = () => {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-medium mb-10">SHOP BY CATEGORY</h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          {/* Men's Category */}
          <Link to="/men-collection" className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[600px]">
            <TiltedCard
              imageSrc={assets.him}
              altText="Men's Collection"
              captionText="FOR HIM"
              containerHeight="360px"
              containerWidth="100%"
              imageHeight="100%"
              imageWidth="100%"
              rotateAmplitude={12}
              scaleOnHover={1.1}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={true}
              overlayContent={
                <div className="absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-300 group-hover:bg-opacity-20 rounded-[15px]">
                  <h3 className="text-white text-2xl font-bold mb-2">FOR HIM</h3>
                  <div className="w-12 h-1 bg-white mb-4"></div>
                  <p className="text-white transition-transform duration-300 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    Explore Collection →
                  </p>
                </div>
              }
            />
          </Link>

          {/* Women's Category */}
          <Link to="/women-collection" className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[600px]">
            <TiltedCard
              imageSrc={assets.her}
              altText="Women's Collection"
              captionText="FOR HER"
              containerHeight="360px"
              containerWidth="100%"
              imageHeight="100%"
              imageWidth="100%"
              rotateAmplitude={12}
              scaleOnHover={1.1}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={true}
              overlayContent={
                <div className="absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-300 group-hover:bg-opacity-20 rounded-[15px]">
                  <h3 className="text-white text-2xl font-bold mb-2">FOR HER</h3>
                  <div className="w-12 h-1 bg-white mb-4"></div>
                  <p className="text-white transition-transform duration-300 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    Explore Collection →
                  </p>
                </div>
              }
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GenderCategories;
