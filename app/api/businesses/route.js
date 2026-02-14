import { NextResponse } from 'next/server';
import { getBusinesses } from '@/lib/getBusinesses';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const params = Object.fromEntries(searchParams.entries());

  const result = await getBusinesses(params);

  if (!result.success) {
      return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result, { status: 200 });
}
