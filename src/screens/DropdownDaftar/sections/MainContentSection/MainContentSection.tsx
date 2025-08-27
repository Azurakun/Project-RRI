import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

export const MainContentSection = (): JSX.Element => {
  const programs = [
    {
      id: 1,
      time: "08:00",
      title: "Dialog Jambi Pagi Ini",
      headerColor: "bg-[#70f7ff]",
      logoSrc: "/g362.png",
      textSrc1: "/text387.png",
      textSrc2: "/text387-0.png",
    },
    {
      id: 2,
      time: "08:00",
      title: "SPADA",
      headerColor: "bg-[#1fffe1]",
      backgroundImage: "bg-[url(/rri-pro-2-jambi-2023--alt--svg-1.png)]",
    },
    {
      id: 3,
      time: "06:00",
      title: "Halo Jambi",
      headerColor: "bg-[#87f38e]",
      logoContainer: "bg-[url(/g2497.png)]",
      logoSrc1: "/g383.png",
      logoSrc2: "/g1547.png",
    },
  ];

  return (
    <section className="w-full bg-gray-50 py-12">
      <div className="max-w-[1280px] mx-auto px-20">
        <div className="flex flex-col items-center mb-16">
          <h2 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-3xl text-center tracking-[0] leading-9 mb-2">
            Program Unggulan
          </h2>
          <p className="[font-family:'Roboto',Helvetica] font-normal text-gray-600 text-base text-center tracking-[0] leading-6">
            Program unggulan RRI Jambi hari ini
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Card
              key={program.id}
              className="bg-white rounded-lg overflow-hidden shadow-[0px_4px_6px_#0000001a,0px_2px_4px_#0000001a] h-[296px]"
            >
              <div
                className={`w-full h-20 ${program.headerColor} flex items-center justify-center`}
              >
                {program.id === 1 && (
                  <div className="relative w-[115px] h-[60px]">
                    <img
                      className="absolute w-[115px] h-[60px] top-0 left-0"
                      alt="G"
                      src={program.logoSrc}
                    />
                    <img
                      className="absolute w-10 h-[9px] top-[42px] left-0"
                      alt="Text"
                      src={program.textSrc1}
                    />
                    <img
                      className="absolute w-[39px] h-2 top-[52px] left-0"
                      alt="Text"
                      src={program.textSrc2}
                    />
                  </div>
                )}

                {program.id === 2 && (
                  <div
                    className={`w-[390px] h-[79px] ${program.backgroundImage} bg-[100%_100%]`}
                  />
                )}

                {program.id === 3 && (
                  <div className="relative w-[118px] h-[63px]">
                    <div
                      className={`w-full h-full ${program.logoContainer} bg-[100%_100%]`}
                    >
                      <img
                        className="absolute w-6 h-[15px] top-0 left-0"
                        alt="G"
                        src={program.logoSrc1}
                      />
                      <img
                        className="absolute w-[41px] h-[19px] top-11 left-0"
                        alt="G"
                        src={program.logoSrc2}
                      />
                    </div>
                  </div>
                )}
              </div>

              <CardContent className="p-4 h-[216px] flex items-center justify-center">
                <div className="text-center">
                  <div className="[font-family:'Roboto',Helvetica] font-medium text-[#212529] text-[32px] tracking-[0] leading-5 mb-4">
                    {program.time}
                  </div>
                  <div className="[font-family:'Roboto',Helvetica] font-normal text-[#212529] text-[32px] tracking-[0] leading-6">
                    {program.title}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
