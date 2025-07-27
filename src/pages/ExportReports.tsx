import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Calendar, 
  Filter,
  CheckCircle,
  Clock,
  RefreshCw,
  X
} from 'lucide-react';
import { mockReports } from '../data/mockData';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface ExportReportsProps {
  onBack: () => void;
}

export function ExportReports({ onBack }: ExportReportsProps) {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [selectedStatus, setSelectedStatus] = useState<string[]>(['all']);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'perawatan', label: 'Perawatan' },
    { value: 'pembangunan', label: 'Pembangunan' },
    { value: 'upgrading', label: 'Upgrading' },
    { value: 'perbaikan', label: 'Perbaikan' }
  ];

  const statuses = [
    { value: 'all', label: 'Semua Status' },
    { value: 'planning', label: 'Perencanaan' },
    { value: 'ongoing', label: 'Berlangsung' },
    { value: 'completed', label: 'Selesai' },
    { value: 'delayed', label: 'Terlambat' }
  ];

  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      setSelectedCategories(['all']);
    } else {
      const newCategories = selectedCategories.filter(c => c !== 'all');
      if (selectedCategories.includes(category)) {
        const filtered = newCategories.filter(c => c !== category);
        setSelectedCategories(filtered.length === 0 ? ['all'] : filtered);
      } else {
        setSelectedCategories([...newCategories, category]);
      }
    }
  };

  const handleStatusChange = (status: string) => {
    if (status === 'all') {
      setSelectedStatus(['all']);
    } else {
      const newStatuses = selectedStatus.filter(s => s !== 'all');
      if (selectedStatus.includes(status)) {
        const filtered = newStatuses.filter(s => s !== status);
        setSelectedStatus(filtered.length === 0 ? ['all'] : filtered);
      } else {
        setSelectedStatus([...newStatuses, status]);
      }
    }
  };

  const getFilteredReports = () => {
    let filtered = mockReports;

    // Filter by category
    if (!selectedCategories.includes('all')) {
      filtered = filtered.filter(report => selectedCategories.includes(report.category));
    }

    // Filter by status
    if (!selectedStatus.includes('all')) {
      filtered = filtered.filter(report => selectedStatus.includes(report.status));
    }

    // Filter by date range
    if (dateRange === 'custom' && customStartDate && customEndDate) {
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.createdAt);
        return reportDate >= new Date(customStartDate) && reportDate <= new Date(customEndDate);
      });
    } else if (dateRange === 'last30') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(report => new Date(report.createdAt) >= thirtyDaysAgo);
    } else if (dateRange === 'last7') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = filtered.filter(report => new Date(report.createdAt) >= sevenDaysAgo);
    }

    return filtered;
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    const filteredReports = getFilteredReports();
    
    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (exportFormat === 'pdf') {
        // Generate PDF
        const pdfContent = generatePDFContent(filteredReports);
        downloadFile(pdfContent, `laporan-pekerjaan-${format(new Date(), 'yyyy-MM-dd')}.pdf`, 'application/pdf');
      } else if (exportFormat === 'excel') {
        // Generate Excel
        const excelContent = generateExcelContent(filteredReports);
        downloadFile(excelContent, `laporan-pekerjaan-${format(new Date(), 'yyyy-MM-dd')}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      } else if (exportFormat === 'csv') {
        // Generate CSV
        const csvContent = generateCSVContent(filteredReports);
        downloadFile(csvContent, `laporan-pekerjaan-${format(new Date(), 'yyyy-MM-dd')}.csv`, 'text/csv');
      }

      alert(`Export berhasil! ${filteredReports.length} laporan telah diexport dalam format ${exportFormat.toUpperCase()}.`);
    } catch (error) {
      alert('Export gagal. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const generatePDFContent = (reports: any[]) => {
    // Simulate PDF generation
    return new Blob(['PDF Content for ' + reports.length + ' reports'], { type: 'application/pdf' });
  };

  const generateExcelContent = (reports: any[]) => {
    // Simulate Excel generation
    return new Blob(['Excel Content for ' + reports.length + ' reports'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  };

  const generateCSVContent = (reports: any[]) => {
    const headers = ['Kode', 'Judul', 'Kategori', 'Status', 'Progress', 'Lokasi', 'Tanggal Mulai', 'Tanggal Selesai'];
    const csvRows = [
      headers.join(','),
      ...reports.map(report => [
        report.code,
        `"${report.title}"`,
        report.category,
        report.status,
        report.progress + '%',
        `"${report.location.name}"`,
        report.startDate,
        report.endDate
      ].join(','))
    ];
    
    return new Blob([csvRows.join('\n')], { type: 'text/csv' });
  };

  const downloadFile = (content: Blob, filename: string, mimeType: string) => {
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredReports = getFilteredReports();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Export Laporan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Download laporan pekerjaan dalam berbagai format
          </p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Kembali</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Format Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Format Export
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: 'pdf', label: 'PDF', icon: FileText, desc: 'Dokumen siap cetak' },
                { value: 'excel', label: 'Excel', icon: FileText, desc: 'Spreadsheet untuk analisis' },
                { value: 'csv', label: 'CSV', icon: FileText, desc: 'Data terstruktur' }
              ].map((format) => (
                <label
                  key={format.value}
                  className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    exportFormat === format.value
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-red-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value={format.value}
                    checked={exportFormat === format.value}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="sr-only"
                  />
                  <format.icon className="w-8 h-8 text-red-600 mb-2" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {format.label}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {format.desc}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Rentang Tanggal
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { value: 'all', label: 'Semua' },
                  { value: 'last7', label: '7 Hari Terakhir' },
                  { value: 'last30', label: '30 Hari Terakhir' },
                  { value: 'custom', label: 'Custom' }
                ].map((range) => (
                  <label
                    key={range.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                      dateRange === range.value
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-red-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="dateRange"
                      value={range.value}
                      checked={dateRange === range.value}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>

              {dateRange === 'custom' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tanggal Selesai
                    </label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Filter Data
            </h3>
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Kategori Pekerjaan
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {categories.map((category) => (
                    <label
                      key={category.value}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.value)}
                        onChange={() => handleCategoryChange(category.value)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {category.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Status Pekerjaan
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {statuses.map((status) => (
                    <label
                      key={status.value}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStatus.includes(status.value)}
                        onChange={() => handleStatusChange(status.value)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {status.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview & Export */}
        <div className="space-y-6">
          {/* Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Preview Export
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Laporan
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {filteredReports.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Format
                </span>
                <span className="font-semibold text-gray-900 dark:text-white uppercase">
                  {exportFormat}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Ukuran Estimasi
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {Math.round(filteredReports.length * 0.5)} MB
                </span>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <button
              onClick={handleExport}
              disabled={isExporting || filteredReports.length === 0}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Exporting... {exportProgress}%</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Export {filteredReports.length} Laporan</span>
                </>
              )}
            </button>

            {isExporting && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              </div>
            )}

            {filteredReports.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                Tidak ada laporan yang sesuai dengan filter
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}