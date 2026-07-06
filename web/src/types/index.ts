export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'tecnic' | 'producer';
}

export interface Producer {
  id: string;
  name: string;
  cpfCnpj: string;
  rg?: string;
  address?: string;
  phone?: string;
  email?: string;
  properties: Property[];
  contracts: Contract[];
}

export interface Property {
  id: string;
  name: string;
  carNumber?: string;
  areaHa: number;
}

export interface Contract {
  id: string;
  producerId: string;
  modality: 'CONSERVACAO' | 'PLANTIO_LIVRE' | 'APP' | 'POMAR';
  status: 'DRAFT' | 'ACTIVE' | 'FINISHED' | 'CANCELLED';
  totalPaymentExpected?: number;
  producer?: Producer;
  trees: Tree[];
  payments: Payment[];
}

export interface Tree {
  id: string;
  contractId: string;
  latitude: number;
  longitude: number;
  plantedDate?: string;
  isVerified: boolean;
  photoUrl?: string;
  syncStatus: string;
}

export interface Payment {
  id: string;
  contractId: string;
  parcel: string;
  amount: number;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
}

export interface TrainingAttendance {
  id: string;
  producerId: string;
  topic: string;
  date: string;
  certificateUrl?: string;
}
