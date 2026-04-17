import { NextRequest, NextResponse } from 'next/server'

const PREVIEW_KEY = process.env.PREVIEW_KEY ?? '720972'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  if (pathname.startsWith('/preview')) {
    // 쿼리에 key가 있으면 쿠키에 저장하고 key 없는 URL로 리다이렉트 (깔끔한 URL)
    const key = searchParams.get('key')
    if (key === PREVIEW_KEY) {
      const url = request.nextUrl.clone()
      url.searchParams.delete('key')
      const response = NextResponse.redirect(url)
      response.cookies.set('preview_key', PREVIEW_KEY, { maxAge: 60 * 60 * 24 })
      return response
    }

    // 쿠키에 저장된 키 확인
    const cookieKey = request.cookies.get('preview_key')?.value
    if (cookieKey === PREVIEW_KEY) {
      return NextResponse.next()
    }

    // 키 없으면 홈으로
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/preview/:path*'],
}
