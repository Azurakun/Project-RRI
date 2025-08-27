import { MailIcon, MapPinIcon, PhoneIcon, RadioIcon } from "lucide-react";
import React from "react";

const quickLinks = [
  { name: "Home", href: "#" },
  { name: "Pro 1", href: "#" },
  { name: "Pro 2", href: "#" },
  { name: "Pro 4", href: "#" },
  { name: "Sejarah", href: "#" },
  { name: "Struktur Organisasi", href: "#" },
  { name: "Event", href: "#" },
];

const contactInfo = [
  {
    icon: MapPinIcon,
    text: "Jl. Jend. Ahmad Yani No.5, Telanaipura, Kec. Telanaipura, Kota Jambi, Jambi 36122",
  },
  {
    icon: PhoneIcon,
    text: "(0741) 63481",
  },
  {
    icon: MailIcon,
    text: "pro3jambi@gmail.com",
  },
  {
    icon: RadioIcon,
    text: "Pro 1: FM 88.5 MHz | Pro 2: FM 90.9 MHz | Pro 4: FM 99.2 MHz",
  },
];

export const FooterSection = (): JSX.Element => {
  return (
    <footer className="w-full bg-[#003dc0] relative">
      <div className="max-w-[1280px] mx-auto px-20 py-12">
        <div className="grid grid-cols-4 gap-8 mb-8">
          {/* Logo and Description Column */}
          <div className="flex flex-col">
            <div className="mb-8">
              <img
                className="w-28 h-[89px] mb-4"
                alt="Rri jambi"
                src="/rri-jambi-2023--1--1.png"
              />
            </div>

            <p className="[font-family:'Roboto',Helvetica] font-normal text-white text-sm text-center leading-5 mb-6">
              RadioIcon Republik Indonesia (RRI) Jambi adalah lembaga penyiaran
              publik yang melayani masyarakat Jambi dengan informasi,
              pendidikan, dan hiburan.
            </p>

            <img
              className="w-[132px] h-7 mx-auto"
              alt="Social media icons"
              src="/div.svg"
            />
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col">
            <h3 className="[font-family:'Roboto',Helvetica] font-bold text-white text-lg leading-7 mb-4">
              Link Cepat
            </h3>

            <nav className="flex flex-col space-y-2">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="[font-family:'Roboto',Helvetica] font-normal text-white text-base leading-6 hover:text-gray-200 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col">
            <h3 className="[font-family:'Roboto',Helvetica] font-bold text-white text-lg leading-7 mb-4">
              Kontak
            </h3>

            <div className="flex flex-col space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <item.icon className="w-4 h-4 text-white mt-1 flex-shrink-0" />
                  <span className="[font-family:'Roboto',Helvetica] font-normal text-white text-base leading-6">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Location Column */}
          <div className="flex flex-col">
            <h3 className="[font-family:'Roboto',Helvetica] font-bold text-white text-lg leading-7 mb-4">
              Lokasi Kami
            </h3>

            <div className="bg-gray-800 rounded-lg overflow-hidden h-48">
              <img
                className="w-full h-full object-cover"
                alt="RadioIcon republik indonesia map location"
                src="/radio-republik-indonesia--rri-jambi-pro-1----google-maps-page-00.png"
              />
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 pt-6">
          <p className="[font-family:'Roboto',Helvetica] font-normal text-white text-sm text-center leading-5">
            ©2025 RadioIcon Republik Indonesia Jambi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
