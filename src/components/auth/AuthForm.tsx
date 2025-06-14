'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      // まず、このメールアドレスでログインを試みる
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInData?.user) {
        setSuccessMessage('このメールアドレスは既に登録されています。ログインしました。')
        router.push('/dashboard')
        router.refresh()
        return
      }

      // ログインに失敗した場合、新規登録を試みる
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      console.log('Signup response:', data)
      
      if (error) {
        console.error('Signup error:', error)
        if (error.message.includes('password')) {
          throw new Error('パスワードは6文字以上で、英数字を含める必要があります')
        } else if (error.message.includes('email')) {
          throw new Error('有効なメールアドレスを入力してください')
        } else {
          throw error
        }
      }

      if (data?.user) {
        setSuccessMessage('確認メールを送信しました。メールをご確認ください。')
      } else {
        setError('登録に失敗しました。もう一度お試しください。')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Sign in error:', error)
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('メールアドレスまたはパスワードが正しくありません')
        } else {
          throw error
        }
      }

      if (data?.user) {
        console.log('Login successful:', data.user)
        router.push('/dashboard')
        router.refresh()
      } else {
        setError('ログインに失敗しました。もう一度お試しください。')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">ログイン / サインアップ</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            onClick={handleSignIn}
            disabled={isLoading}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isLoading ? '処理中...' : 'ログイン'}
          </button>
          <button
            type="button"
            onClick={handleSignUp}
            disabled={isLoading}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            {isLoading ? '処理中...' : 'サインアップ'}
          </button>
        </div>
      </form>
    </div>
  )
} 