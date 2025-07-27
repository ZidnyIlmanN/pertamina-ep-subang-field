import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  X
} from 'lucide-react';
import { mockReports } from '../data/mockData';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { id } from 'date-fns/locale';

interface WorkScheduleProps {
  onBack: () => void;
}

export function WorkSchedule({ onBack }: WorkScheduleProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getReportsForDate = (date: Date) => {
    return mockReports.filter(report => {
      const startDate = new Date(report.startDate);
      const endDate = new Date(report.endDate);
      return date >= startDate && date <= endDate;
    }).filter(report => {
      if (statusFilter !== 'all' && report.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && report.category !== categoryFilter) return false;
      return true;
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      planning: 'bg-gray-500',
      ongoing: 'bg-blue-500',
      completed: 'bg-green-500',
      delayed: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      perawatan: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      pembangunan: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      upgrading: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      perbaikan: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  const upcomingReports = mockReports
    .filter(report => {
      const endDate = new Date(report.endDate);
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      return endDate >= today && endDate <= nextWeek && report.status !== 'completed';
    })
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Jadwal Pekerjaan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Timeline dan deadline proyek pekerjaan
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="planning">Perencanaan</option>
                <option value="ongoing">Berlangsung</option>
                <option value="completed">Selesai</option>
                <option value="delayed">Terlambat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kategori
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Semua Kategori</option>
                <option value="perawatan">Perawatan</option>
                <option value="pembangunan">Pembangunan</option>
                <option value="upgrading">Upgrading</option>
                <option value="perbaikan">Perbaikan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tampilan
              </label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as 'month' | 'week' | 'list')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="month">Bulanan</option>
                <option value="list">List</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {format(currentDate, 'MMMM yyyy', { locale: id })}
                </h2>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Tambah Jadwal</span>
              </button>
            </div>

            {viewMode === 'month' ? (
              /* Calendar Grid */
              <div className="p-6">
                {/* Days of Week */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {monthDays.map((day) => {
                    const dayReports = getReportsForDate(day);
                    const isToday = isSameDay(day, new Date());
                    const isSelected = selectedDate && isSameDay(day, selectedDate);

                    return (
                      <div
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={`min-h-[100px] p-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                          isToday ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : ''
                        } ${
                          isSelected ? 'ring-2 ring-red-500' : ''
                        } ${
                          !isSameMonth(day, currentDate) ? 'opacity-50' : ''
                        }`}
                      >
                        <div className={`text-sm font-medium mb-1 ${
                          isToday ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
                        }`}>
                          {format(day, 'd')}
                        </div>
                        <div className="space-y-1">
                          {dayReports.slice(0, 2).map((report) => (
                            <div
                              key={report.id}
                              className={`text-xs p-1 rounded truncate ${getStatusColor(report.status)} text-white`}
                              title={report.title}
                            >
                              {report.title}
                            </div>
                          ))}
                          {dayReports.length > 2 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              +{dayReports.length - 2} lainnya
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* List View */
              <div className="p-6">
                <div className="space-y-4">
                  {mockReports
                    .filter(report => {
                      if (statusFilter !== 'all' && report.status !== statusFilter) return false;
                      if (categoryFilter !== 'all' && report.category !== categoryFilter) return false;
                      return true;
                    })
                    .map((report) => (
                      <div key={report.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {report.title}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(report.category)}`}>
                                {report.category}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {format(new Date(report.startDate), 'dd MMM', { locale: id })} - 
                                  {format(new Date(report.endDate), 'dd MMM yyyy', { locale: id })}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>{report.location.name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>{report.workerCount} pekerja</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {report.progress}%
                              </div>
                              <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${getStatusColor(report.status)}`}
                                  style={{ width: `${report.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Details */}
          {selectedDate && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {format(selectedDate, 'dd MMMM yyyy', { locale: id })}
              </h3>
              <div className="space-y-3">
                {getReportsForDate(selectedDate).map((report) => (
                  <div key={report.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                      {report.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(report.category)}`}>
                        {report.category}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {report.progress}%
                      </span>
                    </div>
                  </div>
                ))}
                {getReportsForDate(selectedDate).length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    Tidak ada pekerjaan pada tanggal ini
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Upcoming Deadlines */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Deadline Mendekati
              </h3>
            </div>
            <div className="space-y-3">
              {upcomingReports.slice(0, 5).map((report) => (
                <div key={report.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                    {report.title}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>
                        {format(new Date(report.endDate), 'dd MMM yyyy', { locale: id })}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      new Date(report.endDate).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {Math.ceil((new Date(report.endDate).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000))} hari
                    </span>
                  </div>
                </div>
              ))}
              {upcomingReports.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  Tidak ada deadline mendekati
                </p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Statistik Bulan Ini
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Proyek</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {mockReports.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Berlangsung</span>
                <span className="font-semibold text-blue-600">
                  {mockReports.filter(r => r.status === 'ongoing').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Selesai</span>
                <span className="font-semibold text-green-600">
                  {mockReports.filter(r => r.status === 'completed').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Terlambat</span>
                <span className="font-semibold text-red-600">
                  {mockReports.filter(r => r.status === 'delayed').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}