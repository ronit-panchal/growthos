export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/dashboard/:path*', '/api/teams/:path*', '/api/payments/:path*'],
}
