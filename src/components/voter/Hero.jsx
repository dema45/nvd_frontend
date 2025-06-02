import React from "react";
import video2 from "../Assets/video2.mp4";

const HeroSection = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-12 px-6 py-24 md:py-32 max-w-7xl mx-auto min-h-[80vh]" style={{fontFamily:"Poppins"}}>
      
   {/* Text Content */}
<div className="text-center md:text-left md:w-1/2">
  <h1 className="text-4xl md:text-5xl font-normal leading-tight mb10">
    <span className="text-4xl md:text-4xl">Securing Democracy,</span>
    {" "}
    <span className="text-4xl md:text-4xl whitespace-nowrap">
      One{" "}
      <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text text-5xl md:text-5xl">
        Digital&nbsp;Vote
      </span>{" "}
      at a Time
    </span>
  </h1>


        <p className="mt-6 text-gray-600 text-lg leading-relaxed">
          "To achieve a fully digital and secure electoral system, 
          we must put in unwavering effort. As technology evolves,
          new challenges will arise, but by working together with innovation
          and determination—just as our predecessors did—we can build a transparent, 
          reliable, and inclusive digital voting system for our nation."
        </p>

        <div className="mt-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
            Explore More
          </button>
        </div>
      </div>

      {/* Video Content */}
      <div className="w-full md:w-2/3 ">
        <video
          autoPlay
          loop
          muted
          className="w-full h-auto max-h-[550px] rounded-lg border-2 border-blue-500 shadow-lg"
        >
          <source src={video2} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default HeroSection;