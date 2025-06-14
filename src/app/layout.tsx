import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Navigation from "@/components/layout/Navigation";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'タスク管理アプリ',
  description: 'シンプルで使いやすいタスク管理アプリケーション',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let session = null
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data } = await supabase.auth.getSession()
    session = data.session
  } catch (error) {
    console.error('Session error:', error)
  }

  return (
    <html lang="ja">
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50">
          {session && <Navigation />}
          {children}
        </main>
      </body>
    </html>
  )
}
