import React from "react";
import { Layout } from "../components/Layout/Layout";
import { Card, CardContent } from "../components/ui/card";
import { ScheduleCard } from "../components/ScheduleCard";
import { ClockIcon, MicIcon, RadioIcon } from "lucide-react";
import { useSchedules } from "../hooks/useSchedules";

export const Pro2Page = (): JSX.Element => {
  const { schedules, loading, error } = useSchedules('Pro 2');

  return (
    <Layout>
      <section className="w-full bg-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-[#1fffe1] p-6 rounded-full">
                <RadioIcon className="w-16 h-16 text-[#0f4c81]" />
              </div>
            </div>
            <h1 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-4xl mb-4">
              RRI Pro 2 Jambi
            </h1>
            <div className="w-24 h-1 bg-[#0375e5] mx-auto mb-4"></div>
            <p className="[font-family:'Roboto',Helvetica] font-normal text-gray-600 text-lg mb-2">
              FM 90.9 MHz
            </p>
            <p className="[font-family:'Roboto',Helvetica] font-normal text-gray-600 text-base max-w-2xl mx-auto">
              Programa Siaran Daerah yang fokus pada pelestarian budaya lokal, bahasa daerah, dan kearifan lokal Jambi
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-[#0f4c81] to-[#0375e5] text-white">
              <CardContent className="p-6 text-center">
                <RadioIcon className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Frekuensi</h3>
                <p className="text-2xl font-bold">90.9 MHz</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-[#1fffe1] to-[#0375e5] text-white">
              <CardContent className="p-6 text-center">
                <ClockIcon className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Siaran</h3>
                <p className="text-xl font-bold">24 Jam</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-[#0375e5] to-[#003dc0] text-white">
              <CardContent className="p-6 text-center">
                <MicIcon className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Fokus</h3>
                <p className="text-xl font-bold">Budaya Daerah</p>
              </CardContent>
            </Card>
          </div>

          {/* Jadwal Siaran */}
          <div className="mb-12">
            <div className="mb-8">
              <h2 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-2xl">
                Jadwal Siaran Harian
              </h2>
            </div>

            {loading && (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-[#0375e5] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-gray-600">Memuat jadwal...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                Error: {error}
              </div>
            )}

            <div className="space-y-2">
              {schedules.map((item, index) => (
                <ScheduleCard 
                  key={index}
                  item={item}
                  index={index}
                  accentColor="#1fffe1"
                />
              ))}
            </div>
          </div>

          {/* Program Unggulan */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-2xl mb-6 text-center">
              Program Unggulan
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <h3 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-xl mb-3">
                    SPADA (Siaran Pagi Daerah)
                  </h3>
                  <p className="[font-family:'Roboto',Helvetica] font-normal text-gray-700 text-base mb-4">
                    Program unggulan yang menyajikan informasi daerah, budaya lokal, dan bahasa Jambi untuk melestarikan kearifan lokal.
                  </p>
                  <div className="text-sm text-gray-600">
                    <strong>Waktu:</strong> 06:00 - 08:00 WIB
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-6">
                  <h3 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-xl mb-3">
                    Musik Daerah
                  </h3>
                  <p className="[font-family:'Roboto',Helvetica] font-normal text-gray-700 text-base mb-4">
                    Menyajikan musik tradisional Jambi dan Nusantara untuk melestarikan warisan budaya bangsa.
                  </p>
                  <div className="text-sm text-gray-600">
                    <strong>Waktu:</strong> 08:00 - 10:00 WIB
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tentang Pro 2 */}
          <div className="mt-12 bg-[#0f4c81] text-white p-8 rounded-lg">
            <h2 className="[font-family:'Roboto',Helvetica] font-bold text-2xl mb-6 text-center">
              Tentang RRI Pro 2
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-3">Misi Khusus</h3>
                <ul className="space-y-2 text-base">
                  <li>• Melestarikan budaya dan bahasa daerah Jambi</li>
                  <li>• Menyajikan konten lokal yang berkualitas</li>
                  <li>• Menjadi jembatan komunikasi masyarakat daerah</li>
                  <li>• Mendukung pengembangan seni dan budaya lokal</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-3">Keunggulan</h3>
                <ul className="space-y-2 text-base">
                  <li>• Konten 100% berbahasa dan berbudaya lokal</li>
                  <li>• Penyiar yang memahami budaya Jambi</li>
                  <li>• Musik tradisional dan kontemporer daerah</li>
                  <li>• Informasi khusus untuk masyarakat Jambi</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </section>
    </Layout>
  );
};