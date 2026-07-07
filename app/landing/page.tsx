import React from "react";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import StatsSection from "./StatsSection";
import Track from "./Track";
import Loader from "./Loader";
import Footer from "./Footer";
import MagicBento from "@/components/MagicBento";
import Bento from "./Bento";

const Home = () => {
  return (
    <div>
      <HeroSection />

      <Track />

      <Bento />

      <FeaturesSection />

      <div className="flex justify-between overflow-hidden">
        <Loader className="justify-end" />
      </div>
      {/* <StatsSection/>
       */}
    </div>
  );
};

export default Home;
