import React from "react";
import { HeaderSection } from "../HeaderSection/HeaderSection";
import { FooterSection } from "../../screens/DropdownDaftar/sections/FooterSection/FooterSection";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div className="flex flex-col w-full min-h-screen items-start bg-white overflow-hidden">
      <div className="w-full bg-gray-50">
        <HeaderSection />
        <main className="w-full">
          {children}
        </main>
        <FooterSection />
      </div>
    </div>
  );
};