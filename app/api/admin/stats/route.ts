import { NextResponse } from 'next/server';
import { getAdminStats } from '@/lib/getAdminStats';

export async function GET() {
  try {
    const data = await getAdminStats();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
