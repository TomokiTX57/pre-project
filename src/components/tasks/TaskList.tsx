'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Task } from '@/types/task'
import Link from 'next/link'

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('ユーザーが認証されていません')

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      setError(error instanceof Error ? error.message : 'タスクの取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error
      setTasks(tasks.filter(task => task.id !== taskId))
    } catch (error) {
      setError(error instanceof Error ? error.message : 'タスクの削除に失敗しました')
    }
  }

  if (isLoading) return <div>読み込み中...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">タスク一覧</h2>
        <Link
          href="/tasks/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          新規タスク
        </Link>
      </div>
      <div className="grid gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="text-gray-600 mt-1">{task.description}</p>
                <div className="mt-2 flex gap-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status === 'completed' ? '完了' :
                     task.status === 'in_progress' ? '進行中' : '計画中'}
                  </span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority === 'high' ? '高' :
                     task.priority === 'medium' ? '中' : '低'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/tasks/${task.id}`}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  編集
                </Link>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  削除
                </button>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <p>見積時間: {task.estimated_hours}時間</p>
              <p>実績時間: {task.actual_hours}時間</p>
              <p>期限: {new Date(task.due_date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 