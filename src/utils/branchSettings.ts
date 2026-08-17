/**
 * Store & Branch Profile Manager
 * Controls branch locations, hours, contact numbers, and pickup instructions
 */

export interface BranchProfile {
  id: 'main' | 'usa';
  name: string;
  shortName: string;
  address: string;
  landmark: string;
  operatingHours: string;
  contactNumber: string;
  managerName: string;
  pickupInstructions: string;
  status: 'Open' | 'Busy (High Rush)' | 'Closed';
}

export interface StoreGeneralSettings {
  storeName: string;
  tagline: string;
  warehouseLocation: string;
  tinNumber: string;
  fdaLtoNumber: string;
  emergencyHotline: string;
  email: string;
  branches: Record<'main' | 'usa', BranchProfile>;
}

export const DEFAULT_STORE_SETTINGS: StoreGeneralSettings = {
  storeName: 'HENZ HEALTH CARE PRODUCTS TRADING',
  tagline: 'Medical Supplies • Clinical Kits • Hospital Essentials',
  warehouseLocation: 'Warehouse Hub: Aganan, Pavia, Iloilo City',
  tinNumber: '298-410-912-000',
  fdaLtoNumber: 'FDA-CDRRHR-LTO-2023-01984',
  emergencyHotline: '+63 917 582 9140 / (033) 320-8451',
  email: 'orders.henzhealthcare@gmail.com',
  branches: {
    main: {
      id: 'main',
      name: 'Main Branch - Casa Conching Bldg., Jalandoni St, Iloilo City Proper',
      shortName: 'Main Branch (Casa Conching)',
      address: 'Ground Floor, Casa Conching Building, Jalandoni Street, Iloilo City Proper',
      landmark: 'Near UI-PHINMA & Iloilo Doctors College route',
      operatingHours: '7:30 AM - 6:30 PM (Mon - Sat)',
      contactNumber: '0917-582-9140 / (033) 320-8451',
      managerName: 'Grace A. (Branch Supervisor)',
      pickupInstructions: 'Proceed directly to Counter 1 (Pre-Order Claim Desk) and show your reference code or mobile number.',
      status: 'Open',
    },
    usa: {
      id: 'usa',
      name: 'USA Branch - In front of University of San Agustin Gate 5 (USA Gym)',
      shortName: 'USA Branch (San Agustin Gate 5)',
      address: 'Door 2, San Agustin Commercial Arcade, in front of USA Gym Gate 5, General Luna St.',
      landmark: 'Directly facing University of San Agustin Gym Gate 5',
      operatingHours: '7:00 AM - 7:00 PM (Mon - Sat)',
      contactNumber: '0998-441-2093 / (033) 335-1928',
      managerName: 'Arnel M. (USA Station Lead)',
      pickupInstructions: 'Express pickup station right across Gate 5. Dedicated queue for Augustinian nursing and medtech students.',
      status: 'Open',
    },
  },
};

const STORE_SETTINGS_KEY = 'henz_store_branch_settings_v1';

export function getStoreSettings(): StoreGeneralSettings {
  try {
    const saved = localStorage.getItem(STORE_SETTINGS_KEY);
    return saved ? { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(saved) } : DEFAULT_STORE_SETTINGS;
  } catch {
    return DEFAULT_STORE_SETTINGS;
  }
}

export function saveStoreSettings(settings: StoreGeneralSettings): void {
  try {
    localStorage.setItem(STORE_SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}
