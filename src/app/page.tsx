import AuthForm from '@/components/auth/AuthForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            プログラミングタスク管理
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            あなたのプログラミングタスクを効率的に管理しましょう
          </p>
        </div>
        <AuthForm />
      </div>
    </main>
  )
}
