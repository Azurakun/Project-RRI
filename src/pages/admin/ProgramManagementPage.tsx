import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { PlusIcon, EditIcon, TrashIcon, RadioIcon, ImageIcon, SaveIcon, XIcon } from 'lucide-react';
import { useSchedules } from '../../hooks/useSchedules';
import { ScheduleForm } from '../../components/ScheduleForm';
import { ImageUpload } from '../../components/ImageUpload/ImageUpload';
import { Schedule } from '../../lib/db';

export const ProgramManagementPage = (): JSX.Element => {
  const [selectedProgram, setSelectedProgram] = useState<string>('Pro 1');
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [showScheduleImageUpload, setShowScheduleImageUpload] = useState(false);
  const [currentScheduleForImage, setCurrentScheduleForImage] = useState<Schedule | null>(null);
  
  const { schedules, programs, loading, error, createSchedule, updateSchedule, deleteSchedule } = useSchedules(selectedProgram);

  const programTabs = [
    { id: 'Pro 1', name: 'Pro 1 (88.5 MHz)', color: '#70f7ff' },
    { id: 'Pro 2', name: 'Pro 2 (90.9 MHz)', color: '#1fffe1' },
    { id: 'Pro 4', name: 'Pro 4 (99.2 MHz)', color: '#87f38e' },
  ];

  const handleCreateSchedule = () => {
    setEditingSchedule(null);
    setShowForm(true);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setShowForm(true);
  };

  const handleSaveSchedule = async (scheduleData: any) => {
    const programId = programs.find(p => p.name === selectedProgram)?.id;
    if (!programId) {
      return { data: null, error: 'Program not found' };
    }

    const dataWithProgram = {
      ...scheduleData,
      program_id: programId
    };

    if (editingSchedule) {
      return await updateSchedule(editingSchedule.id, dataWithProgram);
    } else {
      return await createSchedule(dataWithProgram);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      await deleteSchedule(id);
    }
  };

  const handleScheduleImageUpload = async (imageUrl: string) => {
    if (currentScheduleForImage) {
      await updateSchedule(currentScheduleForImage.id, {
        ...currentScheduleForImage,
        image_url: imageUrl
      });
    }
    setShowScheduleImageUpload(false);
    setCurrentScheduleForImage(null);
  };

  const handleAddImageToSchedule = (schedule: Schedule) => {
    setCurrentScheduleForImage(schedule);
    setShowScheduleImageUpload(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Program Management</h1>
          <p className="text-gray-600">Manage schedules for all radio programs</p>
        </div>
        <button
          onClick={handleCreateSchedule}
          className="flex items-center gap-2 px-4 py-2 bg-[#0f4c81] text-white rounded-lg hover:bg-[#0375e5] transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add Schedule
        </button>
      </div>

      {/* Program Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {programTabs.map((program) => (
          <button
            key={program.id}
            onClick={() => setSelectedProgram(program.id)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedProgram === program.id
                ? 'bg-white text-[#0f4c81] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {program.name}
          </button>
        ))}
      </div>

      {/* Program Info Card */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div 
              className="p-3 rounded-full"
              style={{ backgroundColor: programTabs.find(p => p.id === selectedProgram)?.color }}
            >
              <RadioIcon className="w-6 h-6 text-[#0f4c81]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                RRI {selectedProgram} Jambi
              </h3>
              <p className="text-gray-600">
                {selectedProgram === 'Pro 1' && 'Programa Siaran Nasional - FM 88.5 MHz'}
                {selectedProgram === 'Pro 2' && 'Programa Siaran Daerah - FM 90.9 MHz'}
                {selectedProgram === 'Pro 4' && 'Programa Siaran Pendidikan - FM 99.2 MHz'}
              </p>
            </div>
            <div className="ml-auto">
              <button
                onClick={handleCreateSchedule}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Add Schedule
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedules List */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedProgram} Schedules ({schedules.length})
            </h3>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-[#0375e5] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Loading schedules...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              Error: {error}
            </div>
          )}

          {!loading && schedules.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <RadioIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No schedules found for {selectedProgram}</p>
              <button
                onClick={handleCreateSchedule}
                className="mt-2 text-[#0375e5] hover:text-[#0f4c81] font-medium"
              >
                Create the first schedule
              </button>
            </div>
          )}

          <div className="space-y-3">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div 
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: '#0f4c81' }}
                    >
                      {schedule.waktu}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{schedule.program_name}</h4>
                      <p className="text-sm text-gray-600">
                        {schedule.penyiar && `Penyiar: ${schedule.penyiar}`}
                        {schedule.kategori && ` • ${schedule.kategori}`}
                        {schedule.durasi && ` • ${schedule.durasi}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddImageToSchedule(schedule)}
                      className="p-2 text-gray-400 hover:text-[#0375e5] hover:bg-white rounded transition-colors"
                      title="Add image"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditSchedule(schedule)}
                      className="p-2 text-gray-400 hover:text-[#0375e5] hover:bg-white rounded transition-colors"
                      title="Edit schedule"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded transition-colors"
                      title="Delete schedule"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Schedule Image Display */}
                {schedule.image_url && (
                  <div className="mt-3">
                    <img
                      src={schedule.image_url}
                      alt={schedule.program_name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                {/* Schedule Description */}
                {schedule.deskripsi && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-700">{schedule.deskripsi}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <ScheduleForm
              schedule={editingSchedule}
              programs={programs}
              onSave={handleSaveSchedule}
              onCancel={() => setShowForm(false)}
              isOpen={showForm}
            />
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {showScheduleImageUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add Image to Schedule
              </h3>
              <button
                onClick={() => setShowScheduleImageUpload(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <ImageUpload
              value={currentScheduleForImage?.image_url || ''}
              onChange={handleScheduleImageUpload}
            />
          </div>
        </div>
      )}
    </div>
  );
};