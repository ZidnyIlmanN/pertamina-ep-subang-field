import React from 'react';
import { DashboardStats } from '../components/Dashboard/DashboardStats';
import { DashboardCharts } from '../components/Dashboard/DashboardCharts';
import { RecentReports } from '../components/Dashboard/RecentReports';
import { QuickActions } from '../components/Dashboard/QuickActions';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview laporan pekerjaan dan statistik sistem
        </p>
      </div>

      <DashboardStats />
      <QuickActions onNavigate={onNavigate} />
      <DashboardCharts />
      <RecentReports />
    </div>
  );
}