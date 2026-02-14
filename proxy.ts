import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // 1. If path starts with /admin, require Admin Role
  if (path.startsWith('/admin')) {
    if (!token) {
       return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        
        if (payload.role !== 'admin') {
            // If logged in but not admin, redirect to user dashboard
            return NextResponse.redirect(new URL('/', request.url));
        }
    } catch {
        return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 2. If path is a protected User route (e.g. root /), require Login
  // actually, let's protect everything except auth/public
  const publicPaths = ['/login', '/signup', '/api/auth'];
  const isPublic = publicPaths.some(p => path.startsWith(p));

  if (!isPublic && !token) {
     return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If we receive a token on a public route (like login), redirect to dashboard? 
  // Optional but good UX.
  if (token && path === '/login') {
      // We'd need to check role to know where to redirect, but for now let's just let them login again or manual nav.
      // Or we can just redirect to / which will handle both (if / is user dashed).
      // Let's keep it simple.
  }

  // 3. If User is logged in but hasDataAccess is false, restrict access
  // Skip if already on /pending-access
  // Also protect API routes (return 403 instead of redirect)
  if (token && !path.startsWith('/admin') && !path.startsWith('/pending-access')) {
      const isApi = path.startsWith('/api');
      // Allow auth API routes
      if (isApi && path.startsWith('/api/auth')) return NextResponse.next();

      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        
        // If user is NOT admin and does NOT have data access
        if (payload.role !== 'admin' && !payload.hasDataAccess) {
             if (isApi) {
                 return NextResponse.json({ success: false, message: 'Access Pending Admin Approval' }, { status: 403 });
             } else {
                 return NextResponse.redirect(new URL('/pending-access', request.url));
             }
        }
      } catch (e) {
          // Token invalid or other error
          if (isApi) {
             return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
          }
          return NextResponse.redirect(new URL('/login', request.url));
      }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
