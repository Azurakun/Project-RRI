import React from "react";
import { Layout } from "../components/Layout/Layout";

export const SejarahPage = (): JSX.Element => {
  return (
    <Layout>
      <section className="w-full bg-white py-16">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-12">
            <h1 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-4xl mb-4">
              Sejarah RRI Jambi
            </h1>
            <div className="w-24 h-1 bg-[#0375e5] mx-auto"></div>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-gray-50 p-8 rounded-lg mb-8">
              <h2 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-2xl mb-4">
                Awal Mula Berdiri
              </h2>
              <p className="[font-family:'Roboto',Helvetica] font-normal text-gray-700 text-base leading-7 mb-4">
                Radio Republik Indonesia (RRI) Jambi didirikan pada tanggal 17 Agustus 1945, bersamaan dengan proklamasi kemerdekaan Indonesia. Sebagai bagian dari lembaga penyiaran publik nasional, RRI Jambi memiliki peran penting dalam menyebarkan informasi dan menjaga persatuan bangsa.
              </p>
              <p className="[font-family:'Roboto',Helvetica] font-normal text-gray-700 text-base leading-7">
                Dengan motto "Sekali di Udara, Tetap di Udara", RRI Jambi telah konsisten melayani masyarakat Jambi selama puluhan tahun dengan berbagai program berkualitas.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-xl mb-3">
                  Visi
                </h3>
                <p className="[font-family:'Roboto',Helvetica] font-normal text-gray-700 text-base leading-6">
                  Menjadi lembaga penyiaran publik yang terdepan dalam memberikan informasi, pendidikan, dan hiburan berkualitas untuk masyarakat Jambi.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-xl mb-3">
                  Misi
                </h3>
                <ul className="[font-family:'Roboto',Helvetica] font-normal text-gray-700 text-base leading-6 space-y-2">
                  <li>• Menyajikan informasi yang akurat dan terpercaya</li>
                  <li>• Melestarikan budaya lokal Jambi</li>
                  <li>• Memberikan hiburan yang mendidik</li>
                </ul>
              </div>
            </div>

            <div className="bg-[#0f4c81] text-white p-8 rounded-lg">
              <h3 className="[font-family:'Roboto',Helvetica] font-bold text-white text-2xl mb-4 text-center">
                Pencapaian Penting
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">80+</div>
                  <div className="text-sm">Tahun Mengudara</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">3</div>
                  <div className="text-sm">Programa Siaran</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <div className="text-sm">Siaran Non-Stop</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};