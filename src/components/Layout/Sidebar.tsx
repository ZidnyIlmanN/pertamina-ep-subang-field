import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  currentPage: string;
  onNavigate: (page: string) => void;
  onClose?: () => void;
}

export function Sidebar({ isOpen, currentPage, onNavigate, onClose }: SidebarProps) {
  const { user } = useAuthContext();

  const handleNavigate = (page: string) => {
    onNavigate(page);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'penanggung_jawab', 'pekerja'] },
    { id: 'reports', label: 'Laporan Pekerjaan', icon: FileText, roles: ['admin', 'penanggung_jawab', 'pekerja'] },
    { id: 'create-report', label: 'Buat Laporan', icon: Plus, roles: ['admin', 'penanggung_jawab', 'pekerja'] },
    { id: 'users', label: 'Manajemen User', icon: Users, roles: ['admin'] },
    { id: 'settings', label: 'Pengaturan', icon: Settings, roles: ['admin', 'penanggung_jawab'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className={`fixed left-0 top-16 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
      isOpen ? 'w-64' : 'w-16 lg:w-16'
    } ${
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`}>
      <div className="p-4">
        <nav className="space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && (
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}