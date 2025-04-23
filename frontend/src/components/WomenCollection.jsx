import React from "react";
import CategoryCollection from "./CategoryCollection";

const WomenCollection = () => {
  return (
    <CategoryCollection 
      preSelectedCategory="Women" 
      title={{ text1: "WOMEN'S ", text2: "COLLECTION" }} 
    />
  );
};

export default WomenCollection;