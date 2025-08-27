import React from "react";

const carouselData = [
  {
    title: "LPP RRI JAMBI",
    subtitle: "Sekali di Udara, Tetap di Udara",
    backgroundImage: "/sddefault-1.png",
  },
];

const navigationDots = [
  { position: "left-[657px]" },
  { position: "left-[692px]" },
];

export const FeaturedProgramsSection = (): JSX.Element => {
  return (
    <section className="w-full h-[400px] bg-[#0f4c81] relative">
      <div className="relative h-[400px]">
        <div className="absolute w-full h-[400px] top-0 left-0 bg-black opacity-30">
          <div className="relative h-[400px]">
            {navigationDots.map((dot, index) => (
              <div
                key={`nav-dot-${index}`}
                className={`${dot.position} absolute w-5 h-5 top-[337px] bg-white rounded-[10px]`}
              />
            ))}

            <img
              className="absolute w-full h-[400px] top-0 left-0 object-cover"
              alt="Featured program background"
              src="/sddefault-1.png"
            />
          </div>
        </div>

        <div className="absolute w-[418px] h-[109px] top-[145px] left-[511px]">
          <h1 className="absolute w-[457px] top-[9px] -left-5 [font-family:'Roboto',Helvetica] font-bold text-white text-[64px] text-center tracking-[0] leading-[48px] whitespace-nowrap">
            LPP RRI JAMBI
          </h1>

          <p className="absolute w-[407px] top-[73px] left-[5px] [font-family:'Roboto',Helvetica] font-normal text-white text-2xl text-center tracking-[0] leading-7 whitespace-nowrap">
            Sekali di Udara, Tetap di Udara
          </p>
        </div>
      </div>
    </section>
  );
};
