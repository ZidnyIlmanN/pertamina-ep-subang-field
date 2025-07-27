import React from 'react';
import { 
  Plus, 
  FileText, 
  Download, 
  MapPin, 
  Calendar, 
  AlertTriangle 
} from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
  disabled?: boolean;
}

function QuickActionCard({ icon, title, description, onClick, color, disabled }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-4 rounded-xl border-2 border-dashed transition-all hover:border-solid hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${color}`}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="text-left">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}

interface QuickActionsProps {
  onNavigate?: (page: string) => void;
}

export function QuickActions({ onNavigate }: QuickActionsProps) {
  const { user } = useAuthContext();

  const actions = [
    {
      icon: <Plus className="w-6 h-6 text-red-600" />,
      title: 'Buat Laporan Baru',
      description: 'Tambahkan laporan pekerjaan terbaru',
      onClick: () => onNavigate?.('create-report'),
      color: 'border-red-200 dark:border-red-800 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/10',
      roles: ['admin', 'penanggung_jawab', 'pekerja']
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      title: 'Lihat Semua Laporan',
      description: 'Browse dan kelola laporan existing',
      onClick: () => onNavigate?.('reports'),
      color: 'border-blue-200 dark:border-blue-800 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10',
      roles: ['admin', 'penanggung_jawab', 'pekerja']
    },
    {
      icon: <Download className="w-6 h-6 text-green-600" />,
      title: 'Export Laporan',
      description: 'Download laporan dalam format PDF/Excel',
      onClick: () => {
        onNavigate?.('export-reports');
      },
      color: 'border-green-200 dark:border-green-800 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/10',
      roles: ['admin', 'penanggung_jawab']
    },
    {
      icon: <MapPin className="w-6 h-6 text-purple-600" />,
      title: 'Peta Lokasi Kerja',
      description: 'Lihat sebaran lokasi pekerjaan',
      onClick: () => {
        onNavigate?.('location-map');
      },
      color: 'border-purple-200 dark:border-purple-800 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10',
      roles: ['admin', 'penanggung_jawab', 'pekerja']
    },
    {
      icon: <Calendar className="w-6 h-6 text-orange-600" />,
      title: 'Jadwal Pekerjaan',
      description: 'Kelola timeline dan deadline',
      onClick: () => {
        onNavigate?.('work-schedule');
      },
      color: 'border-orange-200 dark:border-orange-800 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/10',
      roles: ['admin', 'penanggung_jawab']
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
      title: 'Alert Risiko Tinggi',
      description: 'Monitor proyek dengan risiko tinggi',
      onClick: () => {
        // Filter reports by high risk
        onNavigate?.('reports');
      },
      color: 'border-yellow-200 dark:border-yellow-800 hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/10',
      roles: ['admin', 'penanggung_jawab']
    }
  ];

  const userActions = actions.filter(action => 
    action.roles.includes(user?.role || '')
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Akses cepat ke fitur-fitur utama sistem
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {userActions.map((action, index) => (
          <QuickActionCard key={index} {...action} />
        ))}
      </div>
    </div>
  );
}