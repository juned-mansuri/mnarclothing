import React from "react";
import CategoryCollection from "./CategoryCollection";

const MenCollection = () => {
  return (
    <CategoryCollection 
      preSelectedCategory="Men" 
      title={{ text1: "MEN'S ", text2: "COLLECTION" }} 
    />
  );
};

export default MenCollection;