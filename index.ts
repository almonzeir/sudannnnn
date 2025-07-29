export interface Medication {
  id: string;
  name: string;
  arabicName: string;
  category: string;
  description: string;
  uses: string[];
  dosage: string;
  sideEffects: string[];
  contraindications: string[];
  storage: string;
  price: string;
  availability: string;
  rating: number;
}

export interface Pharmacist {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  location: string;
  responseTime: string;
  languages: string[];
  verified: boolean;
  available: boolean;
}

export interface Question {
  id: string;
  patient_id: string;
  question: string;
  category: string;
  created_at: string;
  status: "pending" | "answered" | "in-progress";
  urgent: boolean;
  patient_name?: string;
}