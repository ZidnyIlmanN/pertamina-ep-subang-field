import React from 'react';
import { 
  Briefcase, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  AlertTriangle, 
  Users 
} from 'lucide-react';
import { mockDashboardStats } from '../../data/mockData';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, change, changeType, icon, color }: StatCardProps) {
  const changeColor = {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {change && (
            <p className={`text-sm mt-1 ${changeColor[changeType || 'neutral']}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function DashboardStats() {
  const stats = mockDashboardStats;

  const statCards = [
    {
      title: 'Total Proyek',
      value: stats.totalProjects,
      change: '+2 dari bulan lalu',
      changeType: 'positive' as const,
      icon: <Briefcase className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Proyek Aktif',
      value: stats.activeProjects,
      change: `${Math.round((stats.activeProjects / stats.totalProjects) * 100)}% dari total`,
      changeType: 'neutral' as const,
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      color: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      title: 'Proyek Selesai',
      value: stats.completedProjects,
      change: '+1 minggu ini',
      changeType: 'positive' as const,
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      color: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Rata-rata Progress',
      value: `${stats.averageProgress}%`,
      change: '+5% dari minggu lalu',
      changeType: 'positive' as const,
      icon: <TrendingUp className="w-6 h-6 text-red-600" />,
      color: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      title: 'Proyek Risiko Tinggi',
      value: stats.highRiskProjects,
      change: 'Perlu perhatian khusus',
      changeType: 'negative' as const,
      icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
      color: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      title: 'Total Pekerja',
      value: stats.totalWorkers,
      change: '+8 dari bulan lalu',
      changeType: 'positive' as const,
      icon: <Users className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}