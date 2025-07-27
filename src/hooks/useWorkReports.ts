import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Database } from '../lib/supabase'
import { useAuth } from './useAuth'
import { useNotifications } from './useNotifications'
import toast from 'react-hot-toast'

type WorkReport = Database['public']['Tables']['work_reports']['Row']
type WorkReportInsert = Database['public']['Tables']['work_reports']['Insert']
type WorkReportUpdate = Database['public']['Tables']['work_reports']['Update']

export interface WorkReportWithProfile extends WorkReport {
  creator?: {
    name: string
    email: string
  }
}

export function useWorkReports() {
  const { user } = useAuth()
  const { createNotification } = useNotifications()
  const [reports, setReports] = useState<WorkReportWithProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('work_reports')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'work_reports'
        },
        () => {
          fetchReports()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('work_reports')
        .select(`
          *,
          creator:profiles!work_reports_created_by_fkey(name, email)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setReports(data || [])
    } catch (error) {
      console.error('Error fetching work reports:', error)
      toast.error('Error loading work reports')
    } finally {
      setLoading(false)
    }
  }

  const createReport = async (reportData: Omit<WorkReportInsert, 'created_by'>) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { data, error } = await supabase
        .from('work_reports')
        .insert({
          ...reportData,
          created_by: user.id
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Laporan berhasil dibuat!')
      
      // Create notification for admins and penanggung_jawab
      const { data: adminUsers } = await supabase
        .from('profiles')
        .select('id')
        .in('role', ['admin', 'penanggung_jawab'])

      if (adminUsers) {
        for (const admin of adminUsers) {
          await createNotification(
            admin.id,
            'Laporan Baru',
            `Laporan baru "${reportData.title}" telah dibuat oleh ${user.name}`,
            'info',
            { reportId: data.id, reportCode: data.code }
          )
        }
      }

      return data
    } catch (error) {
      console.error('Error creating work report:', error)
      toast.error('Error creating work report')
      throw error
    }
  }

  const updateReport = async (id: string, updates: WorkReportUpdate) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { data, error } = await supabase
        .from('work_reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      toast.success('Laporan berhasil diperbarui!')

      // Create notification if status changed
      if (updates.status) {
        const statusLabels = {
          planning: 'Perencanaan',
          ongoing: 'Berlangsung',
          completed: 'Selesai',
          delayed: 'Terlambat'
        }

        // Notify relevant users
        const { data: relevantUsers } = await supabase
          .from('profiles')
          .select('id')
          .in('role', ['admin', 'penanggung_jawab'])

        if (relevantUsers) {
          for (const userProfile of relevantUsers) {
            await createNotification(
              userProfile.id,
              'Status Laporan Diperbarui',
              `Status laporan "${data.title}" diubah menjadi ${statusLabels[updates.status]}`,
              'info',
              { reportId: data.id, reportCode: data.code }
            )
          }
        }
      }

      return data
    } catch (error) {
      console.error('Error updating work report:', error)
      toast.error('Error updating work report')
      throw error
    }
  }

  const deleteReport = async (id: string) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { error } = await supabase
        .from('work_reports')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Laporan berhasil dihapus!')
    } catch (error) {
      console.error('Error deleting work report:', error)
      toast.error('Error deleting work report')
      throw error
    }
  }

  const getReportById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('work_reports')
        .select(`
          *,
          creator:profiles!work_reports_created_by_fkey(name, email)
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error fetching work report:', error)
      throw error
    }
  }

  const generateReportCode = async (year: string) => {
    try {
      const { data, error } = await supabase
        .from('work_reports')
        .select('code')
        .like('code', `%/PEP82600/${year}-SO`)
        .order('code', { ascending: false })

      if (error) throw error

      // Find the next available code
      const usedCodes = data.map(report => {
        const parts = report.code.split('/')
        return parseInt(parts[0])
      }).filter(code => !isNaN(code))

      let nextCode = 1
      while (usedCodes.includes(nextCode)) {
        nextCode++
      }

      return nextCode.toString().padStart(3, '0')
    } catch (error) {
      console.error('Error generating report code:', error)
      throw error
    }
  }

  const uploadPhoto = async (file: File, reportId: string) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${reportId}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('work-reports')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('work-reports')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Error uploading photo:', error)
      throw error
    }
  }

  return {
    reports,
    loading,
    createReport,
    updateReport,
    deleteReport,
    getReportById,
    generateReportCode,
    uploadPhoto,
    refetch: fetchReports
  }
}