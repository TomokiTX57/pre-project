import { supabase } from '@/lib/supabase'
import TaskForm from '@/components/tasks/TaskForm'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditTask({ params }: PageProps) {
  const { data: task } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!task) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">タスクの編集</h1>
          <TaskForm initialData={task} taskId={params.id} />
        </div>
      </div>
    </main>
  )
} 