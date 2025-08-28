import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout/Layout";
import { Card, CardContent } from "../components/ui/card";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import { db, Event } from "../lib/db";

export const EventPage = (): JSX.Element => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM events WHERE is_active = true ORDER BY event_date DESC"
      );
      setEvents(rows as Event[]);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5) + " WIB";
  };

  const currentEvents = events.filter((event) => event.status === "upcoming");
  const pastEvents = events.filter((event) => event.status === "past");

  return (
    <Layout>
      <section className="w-full bg-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h1 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-4xl mb-4">
              Event & Kegiatan
            </h1>
            <div className="w-24 h-1 bg-[#0375e5] mx-auto mb-4"></div>
            <p className="[font-family:'Roboto',Helvetica] font-normal text-gray-600 text-lg">
              Berbagai kegiatan dan acara menarik dari RRI Jambi
            </p>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-[#0375e5] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Memuat event...</p>
            </div>
          )}

          {/* Upcoming Events */}
          {!loading && (
            <div className="mb-16">
            <h2 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-2xl mb-8">
              Event Mendatang
            </h2>
            {currentEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Belum ada event mendatang</p>
              </div>
            ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {currentEvents.map((event) => (
                <Card key={event.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={event.image_url || 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'}
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-xl mb-3">
                      {event.title}
                    </h3>
                    <p className="[font-family:'Roboto',Helvetica] font-normal text-gray-700 text-base mb-4">
                      {event.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CalendarIcon className="w-4 h-4" />
                        <span className="text-sm">{formatDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <ClockIcon className="w-4 h-4" />
                        <span className="text-sm">{formatTime(event.event_time)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPinIcon className="w-4 h-4" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
            </div>
          )}

          {/* Past Events */}
          {!loading && (
            <div>
            <h2 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-2xl mb-8">
              Event Sebelumnya
            </h2>
            {pastEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Belum ada event sebelumnya</p>
              </div>
            ) : (
            <div className="grid md:grid-cols-1 gap-6">
              {pastEvents.map((event) => (
                <Card key={event.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
                  <CardContent className="p-0">
                    <div className="md:flex">
                      <div className="md:w-1/3 aspect-video md:aspect-square overflow-hidden">
                        <img
                          src={event.image_url || 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <h3 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-xl mb-3">
                          {event.title}
                        </h3>
                        <p className="[font-family:'Roboto',Helvetica] font-normal text-gray-700 text-base mb-4">
                          {event.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{formatDate(event.event_date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>{formatTime(event.event_time)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};