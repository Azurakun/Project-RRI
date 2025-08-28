import pool from './mysql';

// Types
export interface Program {
  id: string;
  name: string;
  frequency: string;
  color: string;
  created_at: string;
}

export interface Schedule {
  id: string;
  program_id: string;
  waktu: string;
  program_name: string;
  deskripsi: string;
  penyiar: string;
  kategori: string;
  durasi: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  photo_url: string;
  bio: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  image_url: string;
  category: string;
  status: string;
  max_participants: number;
  contact_info: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const db = pool;