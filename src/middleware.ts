import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    console.log('=== ミドルウェア処理開始 ===')
    console.log('リクエストURL:', request.url)
    console.log('パス:', request.nextUrl.pathname)

    // レスポンスオブジェクトを作成
    const res = NextResponse.next()
    
    // Supabaseクライアントを作成
    const supabase = createMiddlewareClient({ req: request, res })

    // セッションの確認
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('セッション確認エラー:', sessionError)
      return NextResponse.redirect(new URL('/', request.url))
    }

    // セッションの詳細をログ出力
    console.log('セッション状態:', session ? '存在します' : '存在しません')
    if (session) {
      console.log('セッション詳細:', {
        access_token: session.access_token ? '存在します' : '存在しません',
        refresh_token: session.refresh_token ? '存在します' : '存在しません',
        user: session.user ? {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role
        } : '存在しません'
      })
    }

    // 現在のパスを取得（正規化）
    const path = request.nextUrl.pathname.replace(/\/+/g, '/')
    console.log('正規化されたパス:', path)

    // ダッシュボードへのアクセス制御
    if (path === '/dashboard') {
      if (!session) {
        console.log('ダッシュボードへのアクセス: セッションなし - ホームページにリダイレクト')
        return NextResponse.redirect(new URL('/', request.url))
      }

      // セッションの有効性を再確認
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('ユーザー確認エラー:', userError)
        return NextResponse.redirect(new URL('/', request.url))
      }

      // セッションを更新
      const { error: refreshError } = await supabase.auth.refreshSession()
      if (refreshError) {
        console.error('セッション更新エラー:', refreshError)
        return NextResponse.redirect(new URL('/', request.url))
      }

      console.log('ダッシュボードへのアクセス: セッションあり - アクセス許可')
      return res
    }

    // ホームページへのアクセス制御
    if (path === '/') {
      if (session) {
        console.log('ホームページへのアクセス: セッションあり - ダッシュボードにリダイレクト')
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      console.log('ホームページへのアクセス: セッションなし - アクセス許可')
      return res
    }

    console.log('その他のパスへのアクセス - アクセス許可')
    return res
  } catch (error) {
    console.error('ミドルウェアエラー:', error)
    return NextResponse.redirect(new URL('/', request.url))
  } finally {
    console.log('=== ミドルウェア処理終了 ===')
  }
}

// ミドルウェアを適用するパスを制限
export const config = {
  matcher: ['/', '/dashboard', '/dashboard/:path*'],
} 