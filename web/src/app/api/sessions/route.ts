import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const models = Object.keys(prisma);
    console.log('[DEBUG] Available Prisma models:', models);

    // Defensive lookup for the session model
    const sessionModel = (prisma as any).session || (prisma as any).Session;

    if (!sessionModel) {
      console.error('[ERROR] "session" model not found on prisma client. Available:', models);
      return NextResponse.json({ 
        error: 'Database schema mismatch. Please restart the dev server.',
        availableModels: models 
      }, { status: 500 });
    }

    const sessions = await sessionModel.findMany({
      where: { userId },
      orderBy: { lastActive: 'desc' },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('[Sessions API] Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, userAgent, isCurrent } = await request.json();

    if (!userId || !userAgent) {
      return NextResponse.json({ error: 'userId and userAgent are required' }, { status: 400 });
    }

    const sessionModel = (prisma as any).session || (prisma as any).Session;

    if (!sessionModel) {
      console.error('[ERROR] "session" model not found on prisma client in POST');
      return NextResponse.json({ error: 'Database schema mismatch' }, { status: 500 });
    }

    // Use a safer lookup for existing session since we're debugging
    const existingSession = await sessionModel.findFirst({
      where: { userId, userAgent }
    });

    const session = await sessionModel.upsert({
      where: {
        id: existingSession?.id || 'new-session'
      },
      update: {
        lastActive: new Date(),
        isCurrent: isCurrent || false,
      },
      create: {
        userId,
        userAgent,
        isCurrent: isCurrent || false,
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('[Sessions API] Error updating session:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('id');

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
  }

  try {
    const sessionModel = (prisma as any).session || (prisma as any).Session;
    if (!sessionModel) {
      return NextResponse.json({ error: 'Database schema mismatch' }, { status: 500 });
    }

    await sessionModel.delete({
      where: { id: sessionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Sessions API] Error deleting session:', error);
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}
