export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'penanggung_jawab' | 'pekerja';
  avatar?: string;
}

export interface WorkReport {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'perawatan' | 'pembangunan' | 'upgrading' | 'perbaikan';
  startDate: string;
  endDate: string;
  status: 'planning' | 'ongoing' | 'completed' | 'delayed';
  progress: number;
  workerCount: number;
  responsiblePersons: string[];
  location: {
    name: string;
    latitude?: number;
    longitude?: number;
  };
  hsseData: {
    riskLevel: 'low' | 'medium' | 'high';
    weatherCondition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
    safetyIncidents: number;
  };
  photos: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  averageProgress: number;
  highRiskProjects: number;
  totalWorkers: number;
}