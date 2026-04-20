import { NextRequest, NextResponse } from 'next/server'

const PREVIEW_KEY = process.env.PREVIEW_KEY ?? '720972'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  if (pathname.startsWith('/preview')) {
    const key = searchParams.get('key')
    if (key === PREVIEW_KEY) {
      const url = request.nextUrl.clone()
      url.searchParams.delete('key')
      const response = NextResponse.redirect(url)
      response.cookies.set('preview_key', PREVIEW_KEY, { maxAge: 60 * 60 * 24 })
      return response
    }

    const cookieKey = request.cookies.get('preview_key')?.value
    if (cookieKey === PREVIEW_KEY) {
      return NextResponse.next()
    }

    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/preview/:path*'],
}
