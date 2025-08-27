import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

export const LiveStreamSection = (): JSX.Element => {
  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex flex-col items-center mb-[108px]">
          <h2 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-3xl text-center tracking-[0] leading-9 mb-3">
            Siaran Langsung
          </h2>
          <p className="[font-family:'Roboto',Helvetica] font-normal text-gray-600 text-base text-center tracking-[0] leading-6">
            Tonton siaran langsung RRI Jambi melalui YouTube
          </p>
        </div>

        <div className="flex justify-center">
          <Card className="w-full max-w-[896px] bg-gray-100 rounded-lg overflow-hidden shadow-[0px_10px_15px_#0000001a,0px_4px_6px_#0000001a]">
            <CardContent className="p-0">
              <div className="w-full h-[450px] bg-gray-100" />

              <div className="w-full h-[76px] bg-[#0375e5] flex items-center justify-between px-4">
                <div className="flex flex-col">
                  <div className="[font-family:'Roboto',Helvetica] font-medium text-white text-base tracking-[0] leading-6">
                    RRI Jambi Live
                  </div>
                  <div className="[font-family:'Roboto',Helvetica] font-normal text-white text-sm tracking-[0] leading-5">
                    Streaming 24/7
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#ff0000] rounded-full opacity-95" />
                  <div className="[font-family:'Roboto',Helvetica] font-medium text-white text-base tracking-[0] leading-6">
                    LIVE
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
