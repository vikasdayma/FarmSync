import React from "react";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import StatsSection from "./Contact";
import Track from "./Track";
import Leaves from "./Leaves";
import Footer from "./Footer";
import MagicBento from "@/components/MagicBento";
import Bento from "./Bento";
import Contact from "./Contact";

const Home = () => {
  return (
    <div>
      <HeroSection />

      <Track />

      <Bento />

      <FeaturesSection />

      <div className="flex justify-between overflow-hidden">
        <Leaves className="justify-end" />
      </div>

      <Contact/>
      <Footer/>
    </div>
  );
};

export default Home;
