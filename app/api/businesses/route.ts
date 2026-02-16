import { NextResponse } from 'next/server';
import { getBusinesses } from '@/lib/getBusinesses';
import { HTTP_STATUS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const params = Object.fromEntries(searchParams.entries());

  const result = await getBusinesses(params);

  if (!result.success) {
      return NextResponse.json(result, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }

  return NextResponse.json(result, { status: HTTP_STATUS.OK });
}
