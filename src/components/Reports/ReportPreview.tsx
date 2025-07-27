import React from 'react';
import { X, Download, Printer as Print, Eye } from 'lucide-react';
import { WorkReport } from '../../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface ReportPreviewProps {
  report: WorkReport;
  onClose: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
}

export function ReportPreview({ report, onClose, onDownload, onPrint }: ReportPreviewProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      planning: { label: 'Perencanaan', color: 'bg-gray-100 text-gray-800' },
      ongoing: { label: 'Berlangsung', color: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Selesai', color: 'bg-green-100 text-green-800' },
      delayed: { label: 'Terlambat', color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      perawatan: { label: 'Perawatan', color: 'bg-green-100 text-green-800' },
      pembangunan: { label: 'Pembangunan', color: 'bg-blue-100 text-blue-800' },
      upgrading: { label: 'Upgrading', color: 'bg-purple-100 text-purple-800' },
      perbaikan: { label: 'Perbaikan', color: 'bg-red-100 text-red-800' }
    };
    
    const config = categoryConfig[category as keyof typeof categoryConfig];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getRiskBadge = (risk: string) => {
    const riskConfig = {
      low: { label: 'Rendah', color: 'bg-green-100 text-green-800' },
      medium: { label: 'Sedang', color: 'bg-yellow-100 text-yellow-800' },
      high: { label: 'Tinggi', color: 'bg-red-100 text-red-800' }
    };
    
    const config = riskConfig[risk as keyof typeof riskConfig];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        Risiko {config.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <Eye className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Preview Laporan
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {report.code}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {onDownload && (
              <button
                onClick={onDownload}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Download PDF"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
            {onPrint && (
              <button
                onClick={onPrint}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                title="Print"
              >
                <Print className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6" id="report-preview-content">
            {/* Report Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-red-600 font-bold text-xl">P</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">PT Pertamina (Persero)</h1>
                    <p className="text-red-100">Laporan Pekerjaan</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-red-100">Tanggal Cetak</p>
                  <p className="font-semibold">
                    {format(new Date(), 'dd MMMM yyyy', { locale: id })}
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Informasi Dasar
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Kode Laporan
                      </label>
                      <p className="text-gray-900 dark:text-white font-mono">
                        {report.code}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Judul Pekerjaan
                      </label>
                      <p className="text-gray-900 dark:text-white font-semibold">
                        {report.title}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Kategori & Status
                      </label>
                      <div className="flex items-center space-x-2 mt-1">
                        {getCategoryBadge(report.category)}
                        {getStatusBadge(report.status)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Timeline & Progress
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Periode Pelaksanaan
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {format(new Date(report.startDate), 'dd MMM yyyy', { locale: id })} - 
                        {format(new Date(report.endDate), 'dd MMM yyyy', { locale: id })}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Progress Realisasi
                      </label>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-red-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${report.progress}%` }}
                          />
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {report.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Deskripsi Pekerjaan
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {report.description}
                </p>
              </div>
            </div>

            {/* Location & Team */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Lokasi Pekerjaan
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {report.location.name}
                  </p>
                  {report.location.latitude && report.location.longitude && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                      {report.location.latitude.toFixed(6)}, {report.location.longitude.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Tim Pelaksana
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Jumlah Pekerja
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {report.workerCount} orang
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Penanggung Jawab
                    </span>
                    <div className="mt-1">
                      {report.responsiblePersons.map((person, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-sm mr-2 mb-1"
                        >
                          {person}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* HSSE Data */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Data HSSE (Health, Safety, Security, Environment)
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="mb-2">
                      {getRiskBadge(report.hsseData.riskLevel)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tingkat Risiko
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {report.hsseData.weatherCondition === 'sunny' ? '☀️ Cerah' :
                       report.hsseData.weatherCondition === 'cloudy' ? '☁️ Berawan' :
                       report.hsseData.weatherCondition === 'rainy' ? '🌧️ Hujan' : '⛈️ Badai'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Kondisi Cuaca
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {report.hsseData.safetyIncidents}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Insiden Keselamatan
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Photos */}
            {report.photos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Dokumentasi Foto ({report.photos.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {report.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Dokumentasi ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <p>Dibuat: {format(new Date(report.createdAt), 'dd MMM yyyy HH:mm', { locale: id })}</p>
                  <p>Terakhir diperbarui: {format(new Date(report.updatedAt), 'dd MMM yyyy HH:mm', { locale: id })}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">PT Pertamina (Persero)</p>
                  <p>Sistem Manajemen Laporan Pekerjaan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}