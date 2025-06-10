'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { TaskStatus, TaskPriority } from '@/types/task'
import { useRouter } from 'next/navigation'

interface TaskFormProps {
  initialData?: {
    title: string
    description: string
    status: TaskStatus
    priority: TaskPriority
    estimated_hours: number
    actual_hours: number
    due_date: string
  }
  taskId?: string
}

export default function TaskForm({ initialData, taskId }: TaskFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    status: 'planning' as TaskStatus,
    priority: 'medium' as TaskPriority,
    estimated_hours: 0,
    actual_hours: 0,
    due_date: new Date().toISOString().split('T')[0],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('ユーザーが認証されていません')

      if (taskId) {
        // 更新
        const { error } = await supabase
          .from('tasks')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', taskId)
          .eq('user_id', user.id)

        if (error) throw error
      } else {
        // 新規作成
        const { error } = await supabase
          .from('tasks')
          .insert([{
            ...formData,
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }])

        if (error) throw error
      }

      router.push('/dashboard')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'タスクの保存に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">タイトル</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">説明</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">ステータス</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="planning">計画中</option>
          <option value="in_progress">進行中</option>
          <option value="completed">完了</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">優先度</label>
        <select
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">見積時間（時間）</label>
        <input
          type="number"
          value={formData.estimated_hours}
          onChange={(e) => setFormData({ ...formData, estimated_hours: Number(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          min="0"
          step="0.5"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">実績時間（時間）</label>
        <input
          type="number"
          value={formData.actual_hours}
          onChange={(e) => setFormData({ ...formData, actual_hours: Number(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          min="0"
          step="0.5"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">期限</label>
        <input
          type="date"
          value={formData.due_date}
          onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isLoading ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  )
} 