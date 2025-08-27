import { useState, useEffect } from 'react';
import { supabase, Schedule, Program } from '../lib/supabase';

export const useSchedules = (programName: string) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch programs
  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setPrograms(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch programs');
    }
  };

  // Fetch schedules for specific program
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('is_active', true)
        .order('waktu');
      
      if (error) throw error;
      
      // Filter by program name if provided
      const filteredData = programName 
        ? data?.filter(schedule => {
            const program = programs.find(p => p.id === schedule.program_id);
            return program?.name === programName;
          }) || []
        : data || [];
      
      setSchedules(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  };

  // Create new schedule
  const createSchedule = async (scheduleData: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      return await dbOperations.insert('schedules', {
        ...scheduleData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }).then(async (data) => {
        await fetchSchedules();
        return { data, error: null };
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create schedule';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  // Update schedule
  const updateSchedule = async (id: string, scheduleData: Partial<Schedule>) => {
    try {
      return await dbOperations.update('schedules', id, {
        ...scheduleData,
        updated_at: new Date().toISOString()
      }).then(async (data) => {
        await fetchSchedules();
        return { data, error: null };
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update schedule';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  // Delete schedule (soft delete)
  const deleteSchedule = async (id: string, hardDelete = false) => {
    try {
      await dbOperations.delete('schedules', id, !hardDelete);
      await fetchSchedules();
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete schedule';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (programs.length > 0) {
      fetchSchedules();
    }
  }, [programs, programName]);

  return {
    schedules,
    programs,
    loading,
    error,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    refetch: fetchSchedules
  };
};