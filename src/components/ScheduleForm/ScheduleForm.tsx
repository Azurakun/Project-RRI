import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Schedule, Program } from '../../lib/db';
import { XIcon, SaveIcon, PlusIcon } from 'lucide-react';
import { ImageUpload } from '../ImageUpload/ImageUpload';

interface ScheduleFormProps {
  schedule?: Schedule | null;
  programs: Program[];
  onSave: (scheduleData: any) => Promise<{ data: any; error: string | null }>;
  onCancel: () => void;
  isOpen: boolean;
}

export const ScheduleForm = ({ schedule, programs, onSave, onCancel, isOpen }: ScheduleFormProps): JSX.Element => {
  const [formData, setFormData] = useState({
    program_id: '',
    waktu: '',
    program_name: '',
    deskripsi: '',
    penyiar: '',
    kategori: '',
    durasi: '',
    image_url: '',
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (schedule) {
      setFormData({
        program_id: schedule.program_id,
        waktu: schedule.waktu,
        program_name: schedule.program_name,
        deskripsi: schedule.deskripsi,
        penyiar: schedule.penyiar,
        kategori: schedule.kategori,
        durasi: schedule.durasi,
        image_url: schedule.image_url || '',
        is_active: schedule.is_active
      });
    } else {
      setFormData({
        program_id: '',
        waktu: '',
        program_name: '',
        deskripsi: '',
        penyiar: '',
        kategori: '',
        durasi: '',
        image_url: '',
        is_active: true
      });
    }
  }, [schedule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await onSave(formData);
      if (result.error) {
        setError(result.error);
      } else {
        onCancel(); // Close form on success
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (url: string) => {
    setFormData(prev => ({
      ...prev,
      image_url: url
    }));
  };

  if (!isOpen) return <></>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="[font-family:'Roboto',Helvetica] font-bold text-[#0f4c81] text-2xl">
              {schedule ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program
                </label>
                <select
                  name="program_id"
                  value={formData.program_id}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
                >
                  <option value="">Pilih Program</option>
                  {programs.map(program => (
                    <option key={program.id} value={program.id}>
                      {program.name} - {program.frequency}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waktu
                </label>
                <input
                  type="text"
                  name="waktu"
                  value={formData.waktu}
                  onChange={handleChange}
                  placeholder="08:00 - 10:00"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Program
              </label>
              <input
                type="text"
                name="program_name"
                value={formData.program_name}
                onChange={handleChange}
                placeholder="Nama acara/program"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                placeholder="Deskripsi program..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Penyiar
                </label>
                <input
                  type="text"
                  name="penyiar"
                  value={formData.penyiar}
                  onChange={handleChange}
                  placeholder="Nama penyiar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <input
                  type="text"
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleChange}
                  placeholder="Musik, Berita, dll"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durasi
                </label>
                <input
                  type="text"
                  name="durasi"
                  value={formData.durasi}
                  onChange={handleChange}
                  placeholder="120 menit"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0375e5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Schedule Image
              </label>
              <ImageUpload
                value={formData.image_url}
                onChange={handleImageChange}
                maxSize={5}
                placeholder="Upload schedule image"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#0375e5] text-white rounded-md hover:bg-[#0f4c81] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <SaveIcon className="w-4 h-4" />
                    {schedule ? 'Update' : 'Simpan'}
                  </>
                )}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};