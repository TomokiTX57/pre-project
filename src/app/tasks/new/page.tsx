import TaskForm from '@/components/tasks/TaskForm'

export default function NewTask() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">新規タスク</h1>
          <TaskForm />
        </div>
      </div>
    </main>
  )
} 