import React from "react";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsLetterBox from "../components/NewsLetterBox";
import Dither from "../components/Dither";
import Glimpse from "../components/Glimpse";
import Pattern from "../components/Pattern";
import Showcase from "../components/Showcase";
import GenderCategories from "../components/GenderCategories";

const Home = () => {
  return (
    <div className="">
      <Hero className="" />
      <Glimpse className="" />
      {/* <LatestCollection /> */}
      <GenderCategories/>
      <Showcase />
      <BestSeller />
      <OurPolicy />
      <NewsLetterBox />
    </div>
  );
};

export default Home;
