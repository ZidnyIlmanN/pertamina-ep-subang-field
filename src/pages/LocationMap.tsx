import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Filter, 
  Layers, 
  Navigation,
  X,
  Eye,
  Users,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { mockReports } from '../data/mockData';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface LocationMapProps {
  onBack: () => void;
}

interface MapLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  reports: typeof mockReports;
}

export function LocationMap({ onBack }: LocationMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [mapView, setMapView] = useState<'satellite' | 'terrain' | 'roadmap'>('roadmap');
  const [showFilters, setShowFilters] = useState(false);

  // Group reports by location
  const locations: MapLocation[] = mockReports
    .filter(report => report.location.latitude && report.location.longitude)
    .reduce((acc, report) => {
      const existingLocation = acc.find(loc => 
        loc.latitude === report.location.latitude && 
        loc.longitude === report.location.longitude
      );
      
      if (existingLocation) {
        existingLocation.reports.push(report);
      } else {
        acc.push({
          id: report.location.name.replace(/\s+/g, '-').toLowerCase(),
          name: report.location.name,
          latitude: report.location.latitude!,
          longitude: report.location.longitude!,
          reports: [report]
        });
      }
      
      return acc;
    }, [] as MapLocation[])
    .filter(location => {
      const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase());
      const hasMatchingReports = location.reports.some(report => {
        const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
        return matchesStatus && matchesCategory;
      });
      return matchesSearch && hasMatchingReports;
    });

  const getStatusColor = (status: string) => {
    const colors = {
      planning: 'bg-gray-500',
      ongoing: 'bg-blue-500',
      completed: 'bg-green-500',
      delayed: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      perawatan: { label: 'Perawatan', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      pembangunan: { label: 'Pembangunan', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      upgrading: { label: 'Upgrading', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
      perbaikan: { label: 'Perbaikan', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' }
    };
    
    const config = categoryConfig[category as keyof typeof categoryConfig];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getRiskBadge = (risk: string) => {
    const riskConfig = {
      low: { label: 'Rendah', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      medium: { label: 'Sedang', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
      high: { label: 'Tinggi', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' }
    };
    
    const config = riskConfig[risk as keyof typeof riskConfig];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        Risiko {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Peta Lokasi Kerja
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualisasi sebaran lokasi pekerjaan di seluruh Indonesia
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
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="planning">Perencanaan</option>
              <option value="ongoing">Berlangsung</option>
              <option value="completed">Selesai</option>
              <option value="delayed">Terlambat</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Semua Kategori</option>
              <option value="perawatan">Perawatan</option>
              <option value="pembangunan">Pembangunan</option>
              <option value="upgrading">Upgrading</option>
              <option value="perbaikan">Perbaikan</option>
            </select>
            <select
              value={mapView}
              onChange={(e) => setMapView(e.target.value as 'satellite' | 'terrain' | 'roadmap')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="roadmap">Peta Jalan</option>
              <option value="satellite">Satelit</option>
              <option value="terrain">Terrain</option>
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Map Container */}
        <div className="xl:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Map Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-red-600" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {locations.length} Lokasi Ditemukan
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Layers className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Navigation className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="relative h-96 lg:h-[600px] bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-700 dark:to-gray-600">
              {/* Indonesia Map Outline */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-64 h-32 bg-green-200 dark:bg-green-700 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-green-800 dark:text-green-200 font-medium">
                      Peta Indonesia
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Integrasi dengan Google Maps/Leaflet akan ditambahkan
                  </p>
                </div>
              </div>

              {/* Location Markers */}
              {locations.map((location, index) => (
                <div
                  key={location.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${20 + (index * 15) % 60}%`,
                    top: `${30 + (index * 10) % 40}%`
                  }}
                  onClick={() => setSelectedLocation(location)}
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg hover:scale-110 transition-transform">
                      {location.reports.length}
                    </div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-600 rotate-45"></div>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                    {location.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Location Details */}
          {selectedLocation && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedLocation.name}
                </h3>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Koordinat:</span> {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Total Proyek:</span> {selectedLocation.reports.length}
                </div>
              </div>

              <div className="space-y-3">
                {selectedLocation.reports.map((report) => (
                  <div key={report.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2">
                      {report.title}
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {getCategoryBadge(report.category)}
                      {getRiskBadge(report.hsseData.riskLevel)}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{report.workerCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(report.endDate), 'dd MMM', { locale: id })}</span>
                      </div>
                      <span className="font-medium">{report.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Daftar Lokasi
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {locations.map((location) => (
                <div
                  key={location.id}
                  onClick={() => setSelectedLocation(location)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedLocation?.id === location.id
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-red-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {location.name}
                    </h4>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                      {location.reports.length} proyek
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>
                      {location.reports.filter(r => r.status === 'ongoing').length} aktif
                    </span>
                    <span>
                      {location.reports.filter(r => r.hsseData.riskLevel === 'high').length} risiko tinggi
                    </span>
                  </div>
                </div>
              ))}
              {locations.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  Tidak ada lokasi yang sesuai dengan filter
                </p>
              )}
            </div>
          </div>

          {/* Map Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Statistik Lokasi
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Lokasi</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {locations.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Proyek Aktif</span>
                <span className="font-semibold text-blue-600">
                  {locations.reduce((sum, loc) => sum + loc.reports.filter(r => r.status === 'ongoing').length, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Risiko Tinggi</span>
                <span className="font-semibold text-red-600">
                  {locations.reduce((sum, loc) => sum + loc.reports.filter(r => r.hsseData.riskLevel === 'high').length, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Pekerja</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {locations.reduce((sum, loc) => sum + loc.reports.reduce((s, r) => s + r.workerCount, 0), 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Legenda
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Lokasi dengan proyek aktif
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Lokasi dengan proyek selesai
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Lokasi dengan risiko tinggi
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}