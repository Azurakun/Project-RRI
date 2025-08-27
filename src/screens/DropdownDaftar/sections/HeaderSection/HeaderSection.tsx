import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../../../components/ui/navigation-menu";

export const HeaderSection = (): JSX.Element => {
  const navigationItems = [
    { label: "Home", href: "#" },
    { label: "Sejarah", href: "#" },
    { label: "Struktur Organisasi", href: "#" },
    { label: "Event", href: "#" },
  ];

  const programaItems = [
    {
      label: "Pro 1",
      icon: "/476543715-1342384110011281-525292917849427544-n-1-2.png",
    },
    {
      label: "Pro 2",
      icon: "/476543715-1342384110011281-525292917849427544-n-1.png",
    },
    {
      label: "Pro 4",
      icon: "/476543715-1342384110011281-525292917849427544-n-1-1.png",
    },
  ];

  return (
    <header className="w-full h-auto bg-white relative">
      <div className="max-w-[1280px] mx-auto px-20">
        <div className="px-4 py-3">
          <div className="border-b border-gray-300 pb-3">
            <div className="w-[243px] h-[210px] pt-3">
              <img
                className="w-[191px] h-[149px] mt-[27px] ml-[19px]"
                alt="Rri jambi"
                src="/rri-jambi-2023--1--1-1.png"
              />
            </div>
          </div>

          <div className="pt-3">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-8">
                <NavigationMenuItem>
                  <div className="[font-family:'Roboto',Helvetica] font-medium text-[#0f4c81] text-2xl">
                    Home
                  </div>
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
                        <div
                          key={index}
                          className="flex items-center gap-4 px-4 py-1 bg-white border-b border-[#0f4c81] last:border-b-0 hover:bg-gray-50"
                        >
                          <img
                            className="w-[21px] h-[21px] object-cover"
                            alt="Element"
                            src={item.icon}
                          />
                          <span className="[font-family:'Roboto',Helvetica] font-extrabold text-black text-base">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {navigationItems.slice(1).map((item, index) => (
                  <NavigationMenuItem key={index}>
                    <div className="[font-family:'Roboto',Helvetica] font-medium text-[#0f4c81] text-2xl whitespace-nowrap">
                      {item.label}
                    </div>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
