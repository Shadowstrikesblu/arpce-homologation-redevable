import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/endpoints/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Appel du  service d'authentification
    const result = await auth.register(body);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Erreur inscription:', error);
    
    return NextResponse.json(
      { 
        message: error.response?.data?.message || 'Erreur lors de l\'inscription',
        details: error.response?.data?.details 
      },
      { status: error.response?.status || 500 }
    );
}
}