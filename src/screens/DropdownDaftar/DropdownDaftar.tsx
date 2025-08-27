import React from "react";
import { FeaturedProgramsSection } from "./sections/FeaturedProgramsSection/FeaturedProgramsSection";
import { FooterSection } from "./sections/FooterSection/FooterSection";
import { HeaderSection } from "./sections/HeaderSection";
import { LiveStreamSection } from "./sections/LiveStreamSection/LiveStreamSection";
import { MainContentSection } from "./sections/MainContentSection/MainContentSection";

export const DropdownDaftar = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full min-h-screen items-start bg-white overflow-hidden">
      <div className="w-full bg-gray-50">
        <HeaderSection />
        <FeaturedProgramsSection />
        <LiveStreamSection />
        <MainContentSection />
        <FooterSection />
      </div>
    </div>
  );
};
