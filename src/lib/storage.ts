import type { Inquiry, ResponseTemplate, Handover, Customer, Staff, Settings, User } from '@/types';
import {
  sampleInquiries,
  sampleTemplates,
  sampleHandovers,
  sampleCustomers,
  sampleStaff,
  sampleSettings,
} from './sampleData';

const KEYS = {
  inquiries: 'sf_inquiries',
  templates: 'sf_templates',
  handovers: 'sf_handovers',
  customers: 'sf_customers',
  staff: 'sf_staff',
  settings: 'sf_settings',
  currentUser: 'sf_currentUser',
  initialized: 'sf_initialized',
};

export function initializeSampleData(): void {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(KEYS.initialized)) return;

  localStorage.setItem(KEYS.inquiries, JSON.stringify(sampleInquiries));
  localStorage.setItem(KEYS.templates, JSON.stringify(sampleTemplates));
  localStorage.setItem(KEYS.handovers, JSON.stringify(sampleHandovers));
  localStorage.setItem(KEYS.customers, JSON.stringify(sampleCustomers));
  localStorage.setItem(KEYS.staff, JSON.stringify(sampleStaff));
  localStorage.setItem(KEYS.settings, JSON.stringify(sampleSettings));
  localStorage.setItem(KEYS.initialized, 'true');
}

export function getInquiries(): Inquiry[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEYS.inquiries);
  return data ? JSON.parse(data) : [];
}
export function saveInquiries(items: Inquiry[]): void {
  localStorage.setItem(KEYS.inquiries, JSON.stringify(items));
}

export function getTemplates(): ResponseTemplate[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEYS.templates);
  return data ? JSON.parse(data) : [];
}
export function saveTemplates(items: ResponseTemplate[]): void {
  localStorage.setItem(KEYS.templates, JSON.stringify(items));
}

export function getHandovers(): Handover[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEYS.handovers);
  return data ? JSON.parse(data) : [];
}
export function saveHandovers(items: Handover[]): void {
  localStorage.setItem(KEYS.handovers, JSON.stringify(items));
}

export function getCustomers(): Customer[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEYS.customers);
  return data ? JSON.parse(data) : [];
}
export function saveCustomers(items: Customer[]): void {
  localStorage.setItem(KEYS.customers, JSON.stringify(items));
}

export function getStaff(): Staff[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEYS.staff);
  return data ? JSON.parse(data) : [];
}
export function saveStaff(items: Staff[]): void {
  localStorage.setItem(KEYS.staff, JSON.stringify(items));
}

export function getSettings(): Settings {
  if (typeof window === 'undefined') return sampleSettings;
  const data = localStorage.getItem(KEYS.settings);
  return data ? JSON.parse(data) : sampleSettings;
}
export function saveSettings(settings: Settings): void {
  localStorage.setItem(KEYS.settings, JSON.stringify(settings));
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(KEYS.currentUser);
  return data ? JSON.parse(data) : null;
}
export function saveCurrentUser(user: User): void {
  localStorage.setItem(KEYS.currentUser, JSON.stringify(user));
}
export function clearCurrentUser(): void {
  localStorage.removeItem(KEYS.currentUser);
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
}

export function now(): string {
  return new Date().toISOString();
}
