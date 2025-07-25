import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const { data: { session } } = await supabase.auth.getSession()
  const path = request.nextUrl.pathname.replace(/\/+/g, '/')

  if (path === '/dashboard' && !session) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  if (path === '/' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return res
}

export const config = {
  matcher: ['/', '/dashboard', '/dashboard/:path*'],
} 