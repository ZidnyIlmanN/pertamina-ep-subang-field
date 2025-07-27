import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  progressChartData, 
  riskDistributionData, 
  weeklyActivityData 
} from '../../data/mockData';

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Progress Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Progress Pekerjaan Mingguan
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tracking progress berdasarkan kategori pekerjaan
          </p>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={progressChartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
            <XAxis 
              dataKey="week" 
              className="text-gray-600 dark:text-gray-400"
              fontSize={12}
            />
            <YAxis 
              className="text-gray-600 dark:text-gray-400"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg)',
                border: '1px solid var(--tooltip-border)',
                borderRadius: '8px',
                color: 'var(--tooltip-text)'
              }}
              labelStyle={{ color: 'var(--tooltip-text)' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="perawatan" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Perawatan"
            />
            <Line 
              type="monotone" 
              dataKey="pembangunan" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Pembangunan"
            />
            <Line 
              type="monotone" 
              dataKey="upgrading" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              name="Upgrading"
            />
            <Line 
              type="monotone" 
              dataKey="perbaikan" 
              stroke="#EF4444" 
              strokeWidth={2}
              name="Perbaikan"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Distribusi Risiko HSSE
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Persentase proyek berdasarkan tingkat risiko
          </p>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={riskDistributionData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {riskDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg)',
                border: '1px solid var(--tooltip-border)',
                borderRadius: '8px',
                color: 'var(--tooltip-text)'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:col-span-2">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Aktivitas Mingguan
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Laporan masuk vs laporan selesai per hari
          </p>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyActivityData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
            <XAxis 
              dataKey="day" 
              className="text-gray-600 dark:text-gray-400"
              fontSize={12}
            />
            <YAxis 
              className="text-gray-600 dark:text-gray-400"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg)',
                border: '1px solid var(--tooltip-border)',
                borderRadius: '8px',
                color: 'var(--tooltip-text)'
              }}
            />
            <Legend />
            <Bar 
              dataKey="reports" 
              fill="#E31E24" 
              radius={[4, 4, 0, 0]}
              name="Laporan Masuk"
            />
            <Bar 
              dataKey="completed" 
              fill="#10B981" 
              radius={[4, 4, 0, 0]}
              name="Laporan Selesai"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}