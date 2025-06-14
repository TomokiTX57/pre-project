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

  const handleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('=== ログイン処理開始 ===')
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      console.log('認証リクエスト送信:', { email })
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('認証エラー:', error)
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('メールアドレスまたはパスワードが正しくありません')
        } else {
          throw error
        }
      }

      if (data?.user) {
        console.log('認証成功:', data.user)
        setSuccessMessage('ログインに成功しました。リダイレクトします...')
        
        // セッションを更新してからリダイレクト
        console.log('セッション確認中...')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('セッション確認エラー:', sessionError)
          throw new Error('セッションの確認に失敗しました')
        }

        console.log('セッション状態:', session ? '存在します' : '存在しません')
        
        if (session) {
          // サーバー側でセッションをセット
          await fetch('/api/auth/set', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
            }),
          })
          // 強制リロードでサーバー側のセッションを有効化
          window.location.replace('/dashboard')
        } else {
          console.error('セッションが存在しません')
          setError('セッションの作成に失敗しました。もう一度お試しください。')
        }
      } else {
        console.error('ユーザーデータが存在しません')
        setError('ログインに失敗しました。もう一度お試しください。')
      }
    } catch (error) {
      console.error('エラー発生:', error)
      setError(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setIsLoading(false)
      console.log('=== ログイン処理終了 ===')
    }
  }

  const handleSignUp = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('=== サインアップ処理開始 ===')
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      console.log('サインアップリクエスト送信:', { email })
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        console.error('サインアップエラー:', error)
        if (error.message.includes('password')) {
          throw new Error('パスワードは6文字以上で、英数字を含める必要があります')
        } else if (error.message.includes('email')) {
          throw new Error('有効なメールアドレスを入力してください')
        } else {
          throw error
        }
      }

      if (data?.user) {
        console.log('サインアップ成功:', data.user)
        setSuccessMessage('確認メールを送信しました。メールをご確認ください。')
      } else {
        console.error('ユーザーデータが存在しません')
        setError('登録に失敗しました。もう一度お試しください。')
      }
    } catch (error) {
      console.error('エラー発生:', error)
      setError(error instanceof Error ? error.message : 'エラーが発生しました')
    } finally {
      setIsLoading(false)
      console.log('=== サインアップ処理終了 ===')
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
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="button"
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
      </div>
    </div>
  )
} 