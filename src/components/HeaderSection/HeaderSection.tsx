import React from "react";
import { Link, useLocation } from "react-router-dom";
import { UserIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

export const HeaderSection = (): JSX.Element => {
  const location = useLocation();

  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Sejarah", href: "/sejarah" },
    { label: "Struktur Organisasi", href: "/struktur-organisasi" },
    { label: "Event", href: "/event" },
  ];

  const programaItems = [
    {
      label: "Pro 1",
      href: "/pro1",
      icon: "/476543715-1342384110011281-525292917849427544-n-1-2.png",
    },
    {
      label: "Pro 2",
      href: "/pro2",
      icon: "/476543715-1342384110011281-525292917849427544-n-1.png",
    },
    {
      label: "Pro 4",
      href: "/pro4",
      icon: "/476543715-1342384110011281-525292917849427544-n-1-1.png",
    },
  ];

  return (
    <header className="w-full h-auto bg-white relative">
      <div className="max-w-[1280px] mx-auto px-20">
        <div className="px-4 py-3">
          <div className="border-b border-gray-300 pb-3">
            <div className="w-[243px] h-[210px] pt-3">
              <Link to="/">
                <img
                  className="w-[191px] h-[149px] mt-[27px] ml-[19px] hover:opacity-80 transition-opacity"
                  alt="Rri jambi"
                  src="/rri-jambi-2023--1--1-1.png"
                />
              </Link>
            </div>
          </div>

          <div className="pt-3">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-8">
                <NavigationMenuItem>
                  <Link 
                    to="/"
                    className={`[font-family:'Roboto',Helvetica] font-medium text-2xl hover:text-blue-600 transition-colors ${
                      location.pathname === "/" ? "text-[#0375e5]" : "text-[#0f4c81]"
                    }`}
                  >
                    Home
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="[font-family:'Roboto',Helvetica] font-medium text-[#0f4c81] text-2xl bg-transparent hover:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent p-0 h-auto">
                    <div className="flex items-center gap-2">
                      <span>Daftar Programa</span>
                      <img
                        className="w-[18px] h-4"
                        alt="Frame"
                        src="/frame-4.svg"
                      />
                    </div>
                    <img
                      className="w-[197px] h-0.5 mt-2"
                      alt="Line"
                      src="/line-2.svg"
                    />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white border border-[#0f4c81] p-0 min-w-[197px]">
                    <div className="flex flex-col">
                      {programaItems.map((item, index) => (
                        <Link
                          key={index}
                          to={item.href}
                          className={`flex items-center gap-4 px-4 py-1 bg-white border-b border-[#0f4c81] last:border-b-0 hover:bg-gray-50 transition-colors ${
                            location.pathname === item.href ? "bg-blue-50" : ""
                          }`}
                        >
                          <img
                            className="w-[21px] h-[21px] object-cover"
                            alt="Element"
                            src={item.icon}
                          />
                          <span className="[font-family:'Roboto',Helvetica] font-extrabold text-black text-base">
                            {item.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {navigationItems.slice(1).map((item, index) => (
                  <NavigationMenuItem key={index}>
                    <Link 
                      to={item.href}
                      className={`[font-family:'Roboto',Helvetica] font-medium text-2xl whitespace-nowrap hover:text-blue-600 transition-colors ${
                        location.pathname === item.href ? "text-[#0375e5]" : "text-[#0f4c81]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Admin Link */}
            <div className="ml-auto">
              <Link
                to="/admin/login"
                className="flex items-center gap-2 px-4 py-2 bg-[#0f4c81] text-white rounded-md hover:bg-[#0375e5] transition-colors text-sm font-medium"
              >
                <UserIcon className="w-4 h-4" />
                ADMIN
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};