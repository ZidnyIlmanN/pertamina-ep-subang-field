import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Save, 
  X, 
  Upload, 
  MapPin, 
  Calendar, 
  Users, 
  AlertTriangle,
  Camera,
  TrendingUp,
  Hash,
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { mockReports } from '../data/mockData';

const reportSchema = z.object({
  codeSequence: z.string().regex(/^\d{3}$/, 'Kode urut harus 3 digit angka'),
  codeYear: z.string().regex(/^\d{4}$/, 'Tahun harus 4 digit angka'),
  title: z.string().min(1, 'Judul harus diisi'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  category: z.enum(['perawatan', 'pembangunan', 'upgrading', 'perbaikan']),
  startDate: z.string().min(1, 'Tanggal mulai harus diisi'),
  endDate: z.string().min(1, 'Tanggal selesai harus diisi'),
  status: z.enum(['planning', 'ongoing', 'completed', 'delayed']),
  progress: z.number().min(0).max(100),
  workerCount: z.number().min(1, 'Jumlah pekerja minimal 1'),
  responsiblePersons: z.string().min(1, 'Penanggung jawab harus diisi'),
  locationName: z.string().min(1, 'Nama lokasi harus diisi'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  riskLevel: z.enum(['low', 'medium', 'high']),
  weatherCondition: z.enum(['sunny', 'cloudy', 'rainy', 'stormy']),
  safetyIncidents: z.number().min(0, 'Jumlah insiden tidak boleh negatif')
});

type ReportFormData = z.infer<typeof reportSchema>;

interface EditReportProps {
  reportId: string;
  onSuccess: () => void;
}

export function EditReport({ reportId, onSuccess }: EditReportProps) {
  const [report, setReport] = useState(mockReports.find(r => r.id === reportId));
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>(report?.photos || []);
  const [dragActive, setDragActive] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [codeValidation, setCodeValidation] = useState<{
    isValid: boolean;
    message: string;
    isChecking: boolean;
  }>({ isValid: true, message: '', isChecking: false });
  const [usedCodes, setUsedCodes] = useState<string[]>([]);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [originalCode, setOriginalCode] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      codeSequence: report?.code.split('/')[0] || '',
      codeYear: report?.code.split('/')[2]?.split('-')[0] || new Date().getFullYear().toString(),
      title: report?.title,
      description: report?.description,
      category: report?.category,
      startDate: report?.startDate,
      endDate: report?.endDate,
      status: report?.status,
      progress: report?.progress,
      workerCount: report?.workerCount,
      responsiblePersons: report?.responsiblePersons.join(', '),
      locationName: report?.location.name,
      latitude: report?.location.latitude,
      longitude: report?.location.longitude,
      riskLevel: report?.hsseData.riskLevel,
      weatherCondition: report?.hsseData.weatherCondition,
      safetyIncidents: report?.hsseData.safetyIncidents
    }
  });

  const watchedCodeSequence = watch('codeSequence');
  const watchedCodeYear = watch('codeYear');
  const fullReportCode = `${watchedCodeSequence}/PEP82600/${watchedCodeYear}-SO`;

  useEffect(() => {
    if (report) {
      const codeParts = report.code.split('/');
      const yearPart = codeParts[2]?.split('-')[0];
      setOriginalCode(codeParts[0]);
      
      setValue('codeSequence', codeParts[0]);
      setValue('codeYear', yearPart || new Date().getFullYear().toString());
      reset({
        codeSequence: codeParts[0],
        codeYear: yearPart || new Date().getFullYear().toString(),
        title: report.title,
        description: report.description,
        category: report.category,
        startDate: report.startDate,
        endDate: report.endDate,
        status: report.status,
        progress: report.progress,
        workerCount: report.workerCount,
        responsiblePersons: report.responsiblePersons.join(', '),
        locationName: report.location.name,
        latitude: report.location.latitude,
        longitude: report.location.longitude,
        riskLevel: report.hsseData.riskLevel,
        weatherCondition: report.hsseData.weatherCondition,
        safetyIncidents: report.hsseData.safetyIncidents
      });
      setExistingPhotos(report.photos);
    }
  }, [report, reset]);

  // Get used codes from existing reports (excluding current report)
  React.useEffect(() => {
    const codes = mockReports
      .filter(r => r.id !== reportId) // Exclude current report
      .map(r => r.code.split('/')[0]);
    setUsedCodes(codes);
  }, [reportId]);

  // Validate code uniqueness
  React.useEffect(() => {
    if (watchedCodeSequence && watchedCodeSequence.length === 3) {
      setCodeValidation(prev => ({ ...prev, isChecking: true }));
      
      // Simulate API check delay
      const timer = setTimeout(() => {
        // Allow original code to be valid
        if (watchedCodeSequence === originalCode) {
          setCodeValidation({
            isValid: true,
            message: 'Kode asli laporan',
            isChecking: false
          });
          return;
        }

        const isDuplicate = usedCodes.includes(watchedCodeSequence);
        const duplicateReport = mockReports.find(report => 
          report.id !== reportId && report.code.startsWith(`${watchedCodeSequence}/PEP82600`)
        );
        
        if (isDuplicate && duplicateReport) {
          setCodeValidation({
            isValid: false,
            message: `Kode ${watchedCodeSequence} sudah digunakan untuk laporan: ${duplicateReport.title}`,
            isChecking: false
          });
        } else {
          setCodeValidation({
            isValid: true,
            message: 'Kode tersedia',
            isChecking: false
          });
        }
      }, 500);

      return () => clearTimeout(timer);
    } else if (watchedCodeSequence && watchedCodeSequence.length > 0) {
      setCodeValidation({
        isValid: false,
        message: 'Kode urut harus 3 digit angka',
        isChecking: false
      });
    } else {
      setCodeValidation({
        isValid: true,
        message: '',
        isChecking: false
      });
    }
  }, [watchedCodeSequence, usedCodes, originalCode, reportId]);

  const generateAutoCode = () => {
    setIsGeneratingCode(true);
    
    // Find the smallest available code
    setTimeout(() => {
      for (let i = 1; i <= 999; i++) {
        const code = i.toString().padStart(3, '0');
        if (!usedCodes.includes(code)) {
          setValue('codeSequence', code);
          setIsGeneratingCode(false);
          return;
        }
      }
      // If all codes are used (unlikely)
      alert('Semua kode urut sudah terpakai');
      setIsGeneratingCode(false);
    }, 1000);
  };

  const onSubmit = async (data: ReportFormData) => {
    // Check code validation before submitting
    if (!codeValidation.isValid) {
      alert('Silakan perbaiki kode laporan sebelum menyimpan');
      return;
    }

    try {
      // Use the manually set code
      const code = `${data.codeSequence}/PEP82600/${data.codeYear}-SO`;

      // In a real app, this would be an API call
      console.log('Updating report:', {
        ...data,
        id: reportId,
        code,
        photos: [...existingPhotos, ...uploadedPhotos],
        updatedAt: new Date().toISOString()
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Laporan berhasil diperbarui!');
      onSuccess();
    } catch (error) {
      console.error('Error updating report:', error);
      alert('Gagal memperbarui laporan. Silakan coba lagi.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    setUploadedPhotos(prev => [...prev, ...files]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedPhotos(prev => [...prev, ...files]);
    }
  };

  const removeNewPhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude);
          setValue('longitude', position.coords.longitude);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Gagal mendapatkan lokasi. Pastikan GPS aktif.');
          setIsGettingLocation(false);
        }
      );
    } else {
      alert('Browser tidak mendukung geolocation');
      setIsGettingLocation(false);
    }
  };

  if (!report) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Laporan tidak ditemukan
        </h1>
        <button
          onClick={onSuccess}
          className="text-red-600 hover:text-red-700"
        >
          Kembali ke daftar laporan
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Laporan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {report.code} - {report.title}
          </p>
        </div>
        <button
          onClick={onSuccess}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Kembali</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Hash className="w-5 h-5" />
                <span>Kode Laporan</span>
              </h3>
              
              <div className="space-y-4">
                {/* Code Input Fields */}
                <div className="grid grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Kode Urut (XXX)
                    </label>
                    <input
                      {...register('codeSequence')}
                      type="text"
                      maxLength={3}
                      placeholder="001"
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        codeValidation.isValid 
                          ? 'border-gray-300 dark:border-gray-600' 
                          : 'border-red-300 dark:border-red-600'
                      }`}
                    />
                    {errors.codeSequence && (
                      <p className="text-red-600 text-sm mt-1">{errors.codeSequence.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tahun (YYYY)
                    </label>
                    <input
                      {...register('codeYear')}
                      type="text"
                      maxLength={4}
                      placeholder="2025"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    {errors.codeYear && (
                      <p className="text-red-600 text-sm mt-1">{errors.codeYear.message}</p>
                    )}
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={generateAutoCode}
                      disabled={isGeneratingCode}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {isGeneratingCode ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                      <span className="text-sm">
                        {isGeneratingCode ? 'Generate...' : 'Auto Generate'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Code Preview */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Preview Kode Laporan:
                    </span>
                    <div className="flex items-center space-x-2">
                      {codeValidation.isChecking ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                      ) : codeValidation.isValid ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className={`text-lg font-mono font-bold ${
                    codeValidation.isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {fullReportCode || 'XXX/PEP82600/YYYY-SO'}
                  </div>
                  {codeValidation.message && (
                    <p className={`text-sm mt-2 ${
                      codeValidation.isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {codeValidation.message}
                    </p>
                  )}
                </div>

                {/* Used Codes Reference */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Kode yang Sudah Digunakan:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {usedCodes.slice(0, 10).map((code, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded font-mono">
                        {code}
                      </span>
                    ))}
                    {usedCodes.length > 10 && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded">
                        +{usedCodes.length - 10} lainnya
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Informasi Dasar
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Judul Pekerjaan
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Kategori
                    </label>
                    <select
                      {...register('category')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="perawatan">Perawatan</option>
                      <option value="pembangunan">Pembangunan</option>
                      <option value="upgrading">Upgrading</option>
                      <option value="perbaikan">Perbaikan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Jumlah Pekerja
                    </label>
                    <input
                      {...register('workerCount', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    {errors.workerCount && (
                      <p className="text-red-600 text-sm mt-1">{errors.workerCount.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Penanggung Jawab
                  </label>
                  <input
                    {...register('responsiblePersons')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Nama penanggung jawab (pisahkan dengan koma jika lebih dari satu)"
                  />
                  {errors.responsiblePersons && (
                    <p className="text-red-600 text-sm mt-1">{errors.responsiblePersons.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Status & Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Status & Progress</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="planning">Perencanaan</option>
                    <option value="ongoing">Berlangsung</option>
                    <option value="completed">Selesai</option>
                    <option value="delayed">Terlambat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Progress (%)
                  </label>
                  <input
                    {...register('progress', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.progress && (
                    <p className="text-red-600 text-sm mt-1">{errors.progress.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Progress Visual</span>
                  <span>{watch('progress') || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${watch('progress') || 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Timeline Pekerjaan</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tanggal Mulai
                  </label>
                  <input
                    {...register('startDate')}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.startDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tanggal Selesai
                  </label>
                  <input
                    {...register('endDate')}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.endDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.endDate.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Lokasi Pekerjaan</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nama Lokasi
                  </label>
                  <input
                    {...register('locationName')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.locationName && (
                    <p className="text-red-600 text-sm mt-1">{errors.locationName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Latitude
                    </label>
                    <input
                      {...register('latitude', { valueAsNumber: true })}
                      type="number"
                      step="any"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Longitude
                    </label>
                    <input
                      {...register('longitude', { valueAsNumber: true })}
                      type="number"
                      step="any"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="flex items-center space-x-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span>
                    {isGettingLocation ? 'Mendapatkan Lokasi...' : 'Update Lokasi Saat Ini'}
                  </span>
                </button>
              </div>
            </div>

            {/* Photo Management */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>Foto Dokumentasi</span>
              </h3>

              {/* Existing Photos */}
              {existingPhotos.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Foto Existing ({existingPhotos.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingPhoto(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Photos */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-red-400 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-red-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Tambah foto baru
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Browse Files</span>
                </label>
              </div>

              {uploadedPhotos.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Foto Baru ({uploadedPhotos.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedPhotos.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewPhoto(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* HSSE Data */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Data HSSE</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tingkat Risiko
                  </label>
                  <select
                    {...register('riskLevel')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="low">Rendah</option>
                    <option value="medium">Sedang</option>
                    <option value="high">Tinggi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kondisi Cuaca
                  </label>
                  <select
                    {...register('weatherCondition')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="sunny">Cerah</option>
                    <option value="cloudy">Berawan</option>
                    <option value="rainy">Hujan</option>
                    <option value="stormy">Badai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Jumlah Insiden Keselamatan
                  </label>
                  <input
                    {...register('safetyIncidents', { valueAsNumber: true })}
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.safetyIncidents && (
                    <p className="text-red-600 text-sm mt-1">{errors.safetyIncidents.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting || !codeValidation.isValid || codeValidation.isChecking}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {isSubmitting ? 'Menyimpan...' : 
                     !codeValidation.isValid ? 'Perbaiki Kode Laporan' :
                     codeValidation.isChecking ? 'Validasi Kode...' :
                     'Simpan Perubahan'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => reset()}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Reset Form
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}