import React from 'react';
import { Clock, MapPin, Users, AlertTriangle, CheckCircle, PlayCircle } from 'lucide-react';
import { mockReports } from '../../data/mockData';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface StatusBadgeProps {
  status: string;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    planning: { 
      label: 'Perencanaan', 
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      icon: <Clock className="w-3 h-3" />
    },
    ongoing: { 
      label: 'Berlangsung', 
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      icon: <PlayCircle className="w-3 h-3" />
    },
    completed: { 
      label: 'Selesai', 
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      icon: <CheckCircle className="w-3 h-3" />
    },
    delayed: { 
      label: 'Terlambat', 
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      icon: <AlertTriangle className="w-3 h-3" />
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig];

  return (
    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}

interface RiskBadgeProps {
  level: string;
}

function RiskBadge({ level }: RiskBadgeProps) {
  const riskConfig = {
    low: { label: 'Rendah', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    medium: { label: 'Sedang', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
    high: { label: 'Tinggi', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' }
  };

  const config = riskConfig[level as keyof typeof riskConfig];

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

interface ProgressBarProps {
  progress: number;
}

function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div 
        className="bg-red-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function RecentReports() {
  const recentReports = mockReports.slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Laporan Terbaru
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          5 laporan pekerjaan terbaru dalam sistem
        </p>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {recentReports.map((report) => (
          <div key={report.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {report.title}
                  </h4>
                  <StatusBadge status={report.status} />
                  <RiskBadge level={report.hsseData.riskLevel} />
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {report.description}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {report.code}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{report.location.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{report.workerCount} pekerja</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>
                      {format(new Date(report.updatedAt), 'dd MMM yyyy', { locale: id })}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Progress: {report.progress}%
                  </span>
                  <ProgressBar progress={report.progress} />
                </div>
              </div>
              
              {report.photos.length > 0 && (
                <div className="ml-4 flex-shrink-0">
                  <img
                    src={report.photos[0]}
                    alt="Report preview"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  {report.photos.length > 1 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                      +{report.photos.length - 1} foto
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
        <button className="w-full text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium">
          Lihat Semua Laporan →
        </button>
      </div>
    </div>
  );
}