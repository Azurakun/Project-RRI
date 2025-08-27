import React from "react";
import { Layout } from "../components/Layout/Layout";
import { FeaturedProgramsSection } from "../screens/DropdownDaftar/sections/FeaturedProgramsSection/FeaturedProgramsSection";
import { LiveStreamSection } from "../screens/DropdownDaftar/sections/LiveStreamSection/LiveStreamSection";
import { MainContentSection } from "../screens/DropdownDaftar/sections/MainContentSection/MainContentSection";

export const HomePage = (): JSX.Element => {
  return (
    <Layout>
      <FeaturedProgramsSection />
      <LiveStreamSection />
      <MainContentSection />
    </Layout>
  );
};