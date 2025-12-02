import { NextResponse } from 'next/server';

const GATEWAY_BASE_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:9090/api';

export async function GET() {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/onboarding/deployed`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Gateway returned ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from gateway' },
      { status: 500 }
    );
  }
}
