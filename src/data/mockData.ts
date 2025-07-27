import { WorkReport, DashboardStats, User } from '../types';

export const mockReports: WorkReport[] = [
  {
    id: '1',
    code: '008/PEP82600/2025-SO',
    title: 'Perawatan Berkala Tangki Penyimpanan T-301',
    description: 'Pelaksanaan perawatan berkala tangki penyimpanan crude oil T-301 meliputi pembersihan internal, inspeksi visual, dan penggantian seal. Pekerjaan dilakukan sesuai dengan prosedur keselamatan kerja yang berlaku.',
    category: 'perawatan',
    startDate: '2025-01-15',
    endDate: '2025-02-15',
    status: 'ongoing',
    progress: 65,
    workerCount: 8,
    responsiblePersons: ['Budi Santoso', 'Ahmad Wijaya'],
    location: {
      name: 'Kilang Pertamina Cilacap',
      latitude: -7.7326,
      longitude: 109.0122
    },
    hsseData: {
      riskLevel: 'medium',
      weatherCondition: 'sunny',
      safetyIncidents: 0
    },
    photos: [
      'https://images.pexels.com/photos/3862365/pexels-photo-3862365.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2101187/pexels-photo-2101187.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-20T14:30:00Z',
    createdBy: '2'
  },
  {
    id: '2',
    code: '009/PEP82600/2025-SO',
    title: 'Pembangunan Unit Pengolahan Gas Baru',
    description: 'Proyek pembangunan unit pengolahan gas baru dengan kapasitas 100 MMSCFD. Meliputi instalasi equipment utama, piping, instrumentasi, dan sistem kontrol.',
    category: 'pembangunan',
    startDate: '2025-01-10',
    endDate: '2025-06-30',
    status: 'ongoing',
    progress: 35,
    workerCount: 25,
    responsiblePersons: ['Sari Wulandari', 'Hendra Kusuma', 'Rita Sari'],
    location: {
      name: 'Kilang Pertamina Balikpapan',
      latitude: -1.2379,
      longitude: 116.8529
    },
    hsseData: {
      riskLevel: 'high',
      weatherCondition: 'cloudy',
      safetyIncidents: 1
    },
    photos: [
      'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/162568/oil-rig-sea-oil-drilling-162568.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-01-19T16:45:00Z',
    createdBy: '3'
  },
  {
    id: '3',
    code: '010/PEP82600/2025-SO',
    title: 'Upgrading Sistem Kontrol Otomatis',
    description: 'Upgrade sistem kontrol dari pneumatik ke digital dengan implementasi DCS (Distributed Control System) untuk meningkatkan efisiensi operasional.',
    category: 'upgrading',
    startDate: '2025-01-05',
    endDate: '2025-03-15',
    status: 'completed',
    progress: 100,
    workerCount: 12,
    responsiblePersons: ['Budi Santoso'],
    location: {
      name: 'Kilang Pertamina Dumai',
      latitude: 1.6852,
      longitude: 101.4429
    },
    hsseData: {
      riskLevel: 'low',
      weatherCondition: 'sunny',
      safetyIncidents: 0
    },
    photos: [
      'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/159201/circuit-circuit-board-resistor-computer-159201.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    createdAt: '2025-01-05T07:30:00Z',
    updatedAt: '2025-01-18T11:20:00Z',
    createdBy: '2'
  },
  {
    id: '4',
    code: '011/PEP82600/2025-SO',
    title: 'Perbaikan Emergensi Pipa Distribusi',
    description: 'Perbaikan darurat kebocoran pipa distribusi diameter 24 inch pada jalur transmisi BBM. Pekerjaan meliputi penggantian section pipa dan reinforcement.',
    category: 'perbaikan',
    startDate: '2025-01-18',
    endDate: '2025-01-25',
    status: 'ongoing',
    progress: 80,
    workerCount: 15,
    responsiblePersons: ['Ahmad Wijaya', 'Sari Wulandari'],
    location: {
      name: 'Terminal BBM Plumpang',
      latitude: -6.1167,
      longitude: 106.8833
    },
    hsseData: {
      riskLevel: 'high',
      weatherCondition: 'rainy',
      safetyIncidents: 0
    },
    photos: [
      'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    createdAt: '2025-01-18T06:00:00Z',
    updatedAt: '2025-01-20T18:15:00Z',
    createdBy: '3'
  },
  {
    id: '5',
    code: '012/PEP82600/2025-SO',
    title: 'Perawatan Predictive Compressor Gas',
    description: 'Pelaksanaan perawatan predictive pada gas compressor menggunakan teknologi vibration analysis dan thermal imaging untuk early detection.',
    category: 'perawatan',
    startDate: '2025-01-12',
    endDate: '2025-01-30',
    status: 'planning',
    progress: 15,
    workerCount: 6,
    responsiblePersons: ['Hendra Kusuma'],
    location: {
      name: 'Lapangan Gas Arun',
      latitude: 5.1390,
      longitude: 97.0853
    },
    hsseData: {
      riskLevel: 'medium',
      weatherCondition: 'cloudy',
      safetyIncidents: 0
    },
    photos: [],
    createdAt: '2025-01-12T10:00:00Z',
    updatedAt: '2025-01-20T09:30:00Z',
    createdBy: '2'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalProjects: 5,
  activeProjects: 3,
  completedProjects: 1,
  averageProgress: 59,
  highRiskProjects: 2,
  totalWorkers: 66
};

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Pertamina',
    email: 'admin@pertamina.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
  },
  {
    id: '2',
    name: 'Budi Santoso',
    email: 'budi.santoso@pertamina.com',
    role: 'penanggung_jawab',
    avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
  },
  {
    id: '3',
    name: 'Sari Wulandari',
    email: 'sari.wulandari@pertamina.com',
    role: 'pekerja',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
  },
  {
    id: '4',
    name: 'Ahmad Wijaya',
    email: 'ahmad.wijaya@pertamina.com',
    role: 'penanggung_jawab',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
  },
  {
    id: '5',
    name: 'Hendra Kusuma',
    email: 'hendra.kusuma@pertamina.com',
    role: 'penanggung_jawab',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
  },
  {
    id: '6',
    name: 'Rita Sari',
    email: 'rita.sari@pertamina.com',
    role: 'pekerja',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
  }
];

export const progressChartData = [
  { week: 'Minggu 1', perawatan: 20, pembangunan: 15, upgrading: 25, perbaikan: 30 },
  { week: 'Minggu 2', perawatan: 35, pembangunan: 25, upgrading: 45, perbaikan: 55 },
  { week: 'Minggu 3', perawatan: 50, pembangunan: 35, upgrading: 70, perbaikan: 75 },
  { week: 'Minggu 4', perawatan: 65, pembangunan: 45, upgrading: 100, perbaikan: 80 },
];

export const riskDistributionData = [
  { name: 'Risiko Rendah', value: 40, color: '#10B981' },
  { name: 'Risiko Sedang', value: 40, color: '#F59E0B' },
  { name: 'Risiko Tinggi', value: 20, color: '#EF4444' },
];

export const weeklyActivityData = [
  { day: 'Sen', reports: 12, completed: 8 },
  { day: 'Sel', reports: 15, completed: 11 },
  { day: 'Rab', reports: 18, completed: 14 },
  { day: 'Kam', reports: 20, completed: 16 },
  { day: 'Jum', reports: 16, completed: 13 },
  { day: 'Sab', reports: 8, completed: 6 },
  { day: 'Min', reports: 5, completed: 4 },
];