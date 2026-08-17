import { PresetKit } from '../types';

export const PRESET_KITS: PresetKit[] = [
  {
    id: 'kit-bsn-1',
    name: 'BSN 1st Year Duty Kit (Level 1 Nursing)',
    targetAudience: 'Nursing Students (1st & 2nd Year - Fundamentals of Nursing)',
    category: 'Student Clinical Kits',
    description: 'Complete 24-item clinical starter bundle with diagnostic tools, surgical instruments, PPE, and personal wound care kit.',
    discountPercentage: 8,
    items: [
      { productId: 'prod-007', quantity: 1 }, // Aneroid Sphygmomanometer
      { productId: 'prod-008', quantity: 1 }, // Dual Head Stethoscope
      { productId: 'prod-009', quantity: 1 }, // Fingertip Pulse Oximeter
      { productId: 'prod-010', quantity: 1 }, // Digital Clinical Thermometer
      { productId: 'prod-011', quantity: 1 }, // Medical Diagnostic Penlight
      { productId: 'prod-028', quantity: 1 }, // Mosquito Forceps Straight
      { productId: 'prod-029', quantity: 1 }, // Mosquito Forceps Curved
      { productId: 'prod-031', quantity: 1 }, // Lister Bandage Scissors
      { productId: 'prod-032', quantity: 1 }, // Suture Scissors
      { productId: 'prod-033', quantity: 1 }, // Thumb Tissue Forceps
      { productId: 'prod-034', quantity: 1 }, // Needle Holder
      { productId: 'prod-035', quantity: 1 }, // Scalpel Handle #3
      { productId: 'prod-052', quantity: 1 }, // Kidney Basin
      { productId: 'prod-053', quantity: 2 }, // SS Medicine Cup
      { productId: 'prod-060', quantity: 1 }, // Retractable Measuring Tape
      { productId: 'prod-051', quantity: 1 }, // Tourniquet
      { productId: 'prod-001', quantity: 1 }, // Latex Gloves Box
      { productId: 'prod-003', quantity: 1 }, // 3-Ply Masks Box
      { productId: 'prod-005', quantity: 1 }, // Scrub Caps Pack
      { productId: 'prod-022', quantity: 2 }, // Micropore Tape 1"
      { productId: 'prod-020', quantity: 1 }, // Sterile Gauze 2x2 box
      { productId: 'prod-019', quantity: 1 }, // Sterile Gauze 4x4 box
      { productId: 'prod-040', quantity: 1 }, // Betadine 120ml
      { productId: 'prod-041', quantity: 1 }, // Alcohol 500ml
      { productId: 'prod-044', quantity: 1 }, // Alcohol Swabs
      { productId: 'prod-025', quantity: 2 }, // Triangular Bandage
    ],
  },
  {
    id: 'kit-iv-phlebo',
    name: 'IV Therapy & Phlebotomy Student Pack',
    targetAudience: 'BSN 3rd Year / MedTech Clinical Interns',
    category: 'Student Clinical Kits',
    description: 'Comprehensive venipuncture and intravenous infusion practice set.',
    discountPercentage: 5,
    items: [
      { productId: 'prod-045', quantity: 1 }, // IV Cannula 20G
      { productId: 'prod-046', quantity: 1 }, // IV Cannula 22G
      { productId: 'prod-047', quantity: 2 }, // IV Macro Drip Set
      { productId: 'prod-048', quantity: 1 }, // IV Micro Drip Set
      { productId: 'prod-049', quantity: 2 }, // 0.9% NSS 1L
      { productId: 'prod-051', quantity: 1 }, // Tourniquet
      { productId: 'prod-022', quantity: 2 }, // Micropore 1"
      { productId: 'prod-044', quantity: 2 }, // Alcohol Swab box
      { productId: 'prod-013', quantity: 1 }, // 1cc Syringe box
      { productId: 'prod-014', quantity: 1 }, // 3cc Syringe box
      { productId: 'prod-015', quantity: 1 }, // 5cc Syringe box
      { productId: 'prod-002', quantity: 1 }, // Nitrile Gloves box
    ],
  },
  {
    id: 'kit-wound-suture',
    name: 'Minor Surgical & Suture Practice Bundle',
    targetAudience: 'Medical, Nursing & EMT Skills Training',
    category: 'Student Clinical Kits',
    description: 'Essential instruments and sterile supplies for minor surgical debridement and suturing.',
    discountPercentage: 10,
    items: [
      { productId: 'prod-034', quantity: 1 }, // Needle Holder
      { productId: 'prod-032', quantity: 1 }, // Iris Suture Scissors
      { productId: 'prod-033', quantity: 1 }, // Thumb Tissue Forceps
      { productId: 'prod-035', quantity: 1 }, // Scalpel Handle #3
      { productId: 'prod-036', quantity: 1 }, // Scalpel Blades #10 box
      { productId: 'prod-037', quantity: 1 }, // Scalpel Blades #11 box
      { productId: 'prod-038', quantity: 2 }, // Silk Suture 3-0 box
      { productId: 'prod-039', quantity: 1 }, // Betadine 500ml
      { productId: 'prod-019', quantity: 2 }, // Gauze 4x4 box
      { productId: 'prod-021', quantity: 1 }, // Gauze Roll 4" pack
      { productId: 'prod-002', quantity: 1 }, // Nitrile Gloves box
      { productId: 'prod-052', quantity: 1 }, // Kidney Basin
    ],
  },
  {
    id: 'kit-clinic-essential',
    name: 'School / Barangay Health Station Clinic Restock',
    targetAudience: 'School Clinics, RHU, Barangay Health Workers',
    category: 'Hospital & Clinic Supplies',
    description: 'High-turnover diagnostic, first aid, disinfection, and triage supplies.',
    discountPercentage: 7,
    items: [
      { productId: 'prod-007', quantity: 1 }, // Aneroid BP Set
      { productId: 'prod-008', quantity: 1 }, // Stethoscope
      { productId: 'prod-009', quantity: 1 }, // Oximeter
      { productId: 'prod-010', quantity: 2 }, // Digital Thermometers
      { productId: 'prod-001', quantity: 3 }, // Latex Gloves Box
      { productId: 'prod-003', quantity: 4 }, // 3-Ply Face Masks
      { productId: 'prod-041', quantity: 3 }, // 70% Alcohol 500ml
      { productId: 'prod-039', quantity: 2 }, // Betadine 500ml
      { productId: 'prod-044', quantity: 3 }, // Alcohol Swabs
      { productId: 'prod-019', quantity: 2 }, // Gauze 4x4
      { productId: 'prod-020', quantity: 2 }, // Gauze 2x2
      { productId: 'prod-022', quantity: 3 }, // Micropore 1"
      { productId: 'prod-024', quantity: 2 }, // Elastic Bandages
      { productId: 'prod-025', quantity: 4 }, // Triangular Bandages
      { productId: 'prod-054', quantity: 2 }, // Tongue Depressors
      { productId: 'prod-057', quantity: 1 }, // Sharps Container 5L
    ],
  },
];
