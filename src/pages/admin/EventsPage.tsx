import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { PlusIcon, EditIcon, TrashIcon, CalendarIcon, SaveIcon, XIcon, MapPinIcon, ClockIcon } from 'lucide-react';
import { supabase, Event, dbOperations } from '../../lib/supabase';
import { ImageUpload } from '../../components/ImageUpload/ImageUpload';

export const EventsPage = (): JSX.Element => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '00:00',
    location: '',
    image_url: '',
    category: 'general',
    status: 'upcoming',
    max_participants: 0,
    contact_info: '',
    is_featured: false
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('event_date', { ascending: false });
      
      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      event_date: '',
      event_time: '00:00',
      location: '',
      image_url: '',
      category: 'general',
      status: 'upcoming',
      max_participants: 0,
      contact_info: '',
      is_featured: false
    });
    setShowForm(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      event_time: event.event_time,
      location: event.location,
      image_url: event.image_url,
      category: event.category,
      status: event.status,
      max_participants: event.max_participants,
      contact_info: event.contact_info,
      is_featured: event.is_featured
    });
    setShowForm(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.event_date) {
      setError('Title and event date are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editingEvent) {
        await dbOperations.update('events', editingEvent.id, {
          ...formData,
          updated_at: new Date().toISOString()
        });
      } else {
        await dbOperations.insert('events', {
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }

      await fetchEvents();
      setShowForm(false);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save event';
      setError(`Save failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await dbOperations.delete('events', id, true); // soft delete
      await fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setError(null); // Clear error when user starts typing
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'max_participants' ? parseInt(value) || 0 : value
    }));
  };

  const handleImageChange = (url: string) => {
    setFormData(prev => ({
      ...prev,
      image_url: url
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'past': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600">Manage upcoming events and activities</p>
        </div>
        <button
          onClick={handleCreateEvent}
          className="flex items-center gap-2 px-4 py-2 bg-[#0f4c81] text-white rounded-lg hover:bg-[#0375e5] transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading && events.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-[#0375e5] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Loading events...</p>
          </div>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={event.image_url || 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                    {event.is_featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-[#0f4c81] text-lg mb-2">{event.title}</h3>
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>{event.event_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 capitalize">{event.category}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="p-1 text-gray-400 hover:text-[#0375e5] transition-colors"
                        title="Edit event"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete event"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#0f4c81]">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      name="event_date"
                      value={formData.event_date}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Time
                    </label>
                    <input
                      type="time"
                      name="event_time"
                      value={formData.event_time}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Image
                  </label>
                  <ImageUpload
                    value={formData.image_url}
                    onChange={handleImageChange}
                    maxSize={10}
                    placeholder="Upload event image"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
                    >
                      <option value="general">General</option>
                      <option value="music">Music</option>
                      <option value="talk-show">Talk Show</option>
                      <option value="celebration">Celebration</option>
                      <option value="workshop">Workshop</option>
                      <option value="competition">Competition</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="past">Past</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      name="max_participants"
                      value={formData.max_participants}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Information
                  </label>
                  <input
                    type="text"
                    name="contact_info"
                    value={formData.contact_info}
                    onChange={handleChange}
                    placeholder="Phone, email, or other contact details"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#0375e5] focus:ring-[#0375e5] border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Featured Event
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-[#0375e5] text-white rounded-md hover:bg-[#0f4c81] transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <SaveIcon className="w-4 h-4" />
                        {editingEvent ? 'Update' : 'Save'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};