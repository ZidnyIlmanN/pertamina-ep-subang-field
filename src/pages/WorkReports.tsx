import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Calendar,
  Users,
  Download,
  Eye
} from 'lucide-react';
import { mockReports } from '../data/mockData';
import { WorkReport } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ReportPreview } from '../components/Reports/ReportPreview';

interface WorkReportsProps {
  onEdit: (id: string) => void;
}

export function WorkReports({ onEdit }: WorkReportsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [previewReport, setPreviewReport] = useState<WorkReport | null>(null);

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleSelectReport = (id: string) => {
    setSelectedReports(prev => 
      prev.includes(id) 
        ? prev.filter(reportId => reportId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedReports(
      selectedReports.length === filteredReports.length 
        ? [] 
        : filteredReports.map(report => report.id)
    );
  };

  const handlePreview = (report: WorkReport) => {
    setPreviewReport(report);
  };

  const handleDownloadPDF = () => {
    // Implement PDF download functionality
    alert('Fitur download PDF akan segera tersedia');
  };

  const handlePrint = () => {
    // Implement print functionality
    window.print();
  };
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      planning: { label: 'Perencanaan', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
      ongoing: { label: 'Berlangsung', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      completed: { label: 'Selesai', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      delayed: { label: 'Terlambat', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Laporan Pekerjaan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola dan monitor semua laporan pekerjaan
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Buat Laporan</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari laporan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
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

          {/* Category Filter */}
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

          {/* Export Button */}
          <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedReports.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800 dark:text-blue-300">
              {selectedReports.length} laporan dipilih
            </span>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Export Selected
              </button>
              <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedReports.length === filteredReports.length && filteredReports.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Kode & Judul
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Lokasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedReports.includes(report.id)}
                      onChange={() => handleSelectReport(report.id)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {report.code}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                        {report.title}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {getCategoryBadge(report.category)}
                        {getRiskBadge(report.hsseData.riskLevel)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${report.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {report.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{report.location.name}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-500 mt-1">
                      <Users className="w-3 h-3" />
                      <span>{report.workerCount} pekerja</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(new Date(report.startDate), 'dd MMM', { locale: id })} - 
                          {format(new Date(report.endDate), 'dd MMM yyyy', { locale: id })}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handlePreview(report)}
                        className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onEdit(report.id)}
                        className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              Tidak ada laporan ditemukan
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Coba ubah filter pencarian atau buat laporan baru
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredReports.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Menampilkan {filteredReports.length} dari {mockReports.length} laporan
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
              Previous
            </button>
            <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
              1
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
              2
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
              Next
            </button>
          </div>
        </div>
      )}

      {/* Report Preview Modal */}
      {previewReport && (
        <ReportPreview
          report={previewReport}
          onClose={() => setPreviewReport(null)}
          onDownload={handleDownloadPDF}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
}