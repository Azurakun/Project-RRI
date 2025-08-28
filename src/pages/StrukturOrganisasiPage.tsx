import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout/Layout";
import { Card, CardContent } from "../components/ui/card";
import { db, OrganizationMember } from "../lib/db";

export const StrukturOrganisasiPage = (): JSX.Element => {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM organization_members WHERE is_active = true ORDER BY order_index"
      );
      setMembers(rows as OrganizationMember[]);
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="w-full bg-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h1 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-4xl mb-4">
              Struktur Organisasi
            </h1>
            <div className="w-24 h-1 bg-[#0375e5] mx-auto mb-4"></div>
            <p className="[font-family:'Roboto',Helvetica] font-normal text-gray-600 text-lg">
              Struktur kepemimpinan RRI Jambi yang profesional dan berpengalaman
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-[#0375e5] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-gray-600">Memuat struktur organisasi...</p>
              </div>
            ) : (
              members.map((member) => (
              <Card key={member.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.photo_url || 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'}
                      alt={member.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-lg mb-2">
                      {member.name}
                    </h3>
                    <p className="[font-family:'Roboto',Helvetica] font-medium text-gray-600 text-base">
                      {member.position}
                    </p>
                    {member.department && (
                      <p className="[font-family:'Roboto',Helvetica] font-normal text-gray-500 text-sm mt-1">
                        {member.department}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
              ))
            )}
          </div>

          <div className="mt-16 bg-gray-50 p-8 rounded-lg">
            <h2 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-2xl mb-6 text-center">
              Bagan Organisasi
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-center">
                <div className="bg-[#0f4c81] text-white p-4 rounded-lg mb-6 inline-block">
                  <div className="font-bold text-lg">Kepala Stasiun</div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {['Programa', 'Teknik', 'Berita', 'Administrasi', 'Keuangan'].map((seksi, index) => (
                    <div key={index} className="bg-[#0375e5] text-white p-3 rounded-lg">
                      <div className="font-medium text-sm">Kepala Seksi</div>
                      <div className="font-bold text-base">{seksi}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};