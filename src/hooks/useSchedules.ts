import { useState, useEffect } from 'react';
import { db, Schedule, Program } from '../lib/db';

export const useSchedules = (programName: string) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = async () => {
    try {
      const [rows] = await db.query('SELECT * FROM programs ORDER BY name');
      setPrograms(rows as Program[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch programs');
    }
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const [rows] = await db.query('SELECT * FROM schedules WHERE is_active = true ORDER BY waktu');
      
      const allSchedules = rows as Schedule[];

      // Filter by program name if provided
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
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (programs.length > 0) {
      fetchSchedules();
    }
  }, [programs, programName]);

  return { schedules, programs, loading, error, refetch: fetchSchedules };
};