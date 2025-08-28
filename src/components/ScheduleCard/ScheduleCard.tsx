import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, MicIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Schedule } from "../../lib/db";

interface ScheduleCardProps {
  item: Schedule;
  index: number;
  accentColor: string;
}

export const ScheduleCard = ({ item, index, accentColor }: ScheduleCardProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mb-4">
      <Card 
        className={`bg-white border-l-4 hover:shadow-md transition-all duration-300 cursor-pointer ${
          isExpanded ? 'shadow-lg' : 'shadow-sm'
        }`}
        style={{ borderLeftColor: accentColor }}
        onClick={toggleExpanded}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div 
                className="text-white px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: '#0f4c81' }}
              >
                {item.waktu}
              </div>
              <h3 className="[font-family:'Roboto',Helvetica] font-medium text-[#0f4c81] text-lg flex-1">
                {item.program_name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <MicIcon className="w-5 h-5 text-gray-400" />
              {isExpanded ? (
                <ChevronUpIcon className="w-5 h-5 text-gray-400 transition-transform duration-300" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-400 transition-transform duration-300" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expanded Content Card */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <Card 
          className="bg-gray-50 border-l-4 mt-2 ml-4"
          style={{ borderLeftColor: accentColor }}
        >
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Side - Schedule Details */}
              <div className="space-y-3">
                <h4 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-lg mb-3">
                  Detail Jadwal
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600 text-sm">Waktu:</span>
                    <span className="text-gray-800 text-sm">{item.waktu}</span>
                  </div>
                  {item.durasi && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600 text-sm">Durasi:</span>
                      <span className="text-gray-800 text-sm">{item.durasi}</span>
                    </div>
                  )}
                  {item.penyiar && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600 text-sm">Penyiar:</span>
                      <span className="text-gray-800 text-sm">{item.penyiar}</span>
                    </div>
                  )}
                  {item.kategori && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600 text-sm">Kategori:</span>
                      <span 
                        className="text-white text-xs px-2 py-1 rounded-full"
                        style={{ backgroundColor: accentColor }}
                      >
                        {item.kategori}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Content Description */}
              <div>
                <h4 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-lg mb-3">
                  Tentang Program
                </h4>
                <p className="[font-family:'Roboto',Helvetica] font-normal text-gray-700 text-base leading-6">
                  {item.deskripsi || `Program ${item.program_name} menyajikan konten berkualitas yang informatif dan menghibur untuk pendengar setia RRI Jambi. Dengan format siaran yang menarik dan interaktif.`}
                </p>
                
                {/* Schedule Image */}
                {item.image_url && (
                  <div className="mt-4">
                    <img
                      src={item.image_url}
                      alt={item.program_name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};