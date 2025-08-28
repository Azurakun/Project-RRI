import { useState, useEffect } from 'react';
import { Schedule, Program } from '../lib/db';

const API_BASE_URL = 'http://localhost:3001/api';

export const useSchedules = (programName: string) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/schedules`);
      if (!response.ok) throw new Error('Failed to fetch');
      const allSchedules: Schedule[] = await response.json();

      // This part remains the same, assuming programs are fetched or defined elsewhere
      const filteredData = programName
        ? allSchedules.filter(schedule => {
            const program = programs.find(p => p.id === schedule.program_id);
            return program?.name === programName;
          })
        : allSchedules;

      setSchedules(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // In a real app, you might fetch programs from an API as well
    // For now, we'll assume they are loaded or static
    fetchSchedules();
  }, [programs, programName]);


  return { schedules, programs, loading, error, refetch: fetchSchedules };
};