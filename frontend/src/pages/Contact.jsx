import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";

const Contact = () => {
  return (
    <div>
      <div className=" text-center text-2xl pt-10 border-t">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img
          className="w-full md:max-w-[480px] object-cover rounded-[15px] m-10"
          src={assets.mnarlogobird}
          alt=""
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className=" font-semibold text-xl text-gray-600">Our Store</p>
          <p className=" text-gray-500">
            458001 , Building No - 47, Ward No . 11 , Chakrawati Colony, Near
            Pamnani Hospital
            <br /> Mandsaur , Madhya Pradesh
          </p>
          <p className=" text-gray-500">
            Tel: (+91) 7804023523 <br /> Email : mnarclothing@gmail.com
          </p>
          <p className=" font-semibold text-xl text-gray-600">
            Careers At our Business
          </p>
          <p className=" text-gray-500">
            Learn More about Our team and job openings.
          </p>
          <a href="#contact">
            <button className=" border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
              Explore Jobs
            </button>
          </a>
        </div>
      </div>
      <p id="contact"></p>
      <NewsLetterBox />
    </div>
  );
};

export default Contact;
