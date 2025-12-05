import { NextRequest, NextResponse } from 'next/server';
import { getSubmissions, getSubmissionStats, deleteSubmission, exportSubmissionsCSV, initDatabase } from '../../../../lib/db';

const SESSION_TOKEN = 'rc_admin_session_2025';

function isAuthenticated(request: NextRequest): boolean {
  const session = request.cookies.get('admin_session');
  return session?.value === SESSION_TOKEN;
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ 
      error: 'Datenbank nicht konfiguriert',
      submissions: [],
      stats: { total: 0, lichtblicke: 0, diospiSuyana: 0, todayCount: 0, thisWeekCount: 0 }
    });
  }

  try {
    await initDatabase();

    if (action === 'export') {
      const csv = await exportSubmissionsCSV();
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="teilnahmen_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    if (action === 'stats') {
      const stats = await getSubmissionStats();
      return NextResponse.json({ stats });
    }

    const submissions = await getSubmissions();
    const stats = await getSubmissionStats();

    return NextResponse.json({ submissions, stats });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Teilnahmen', submissions: [], stats: null },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Datenbank nicht konfiguriert' }, { status: 400 });
  }

  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID erforderlich' }, { status: 400 });
    }

    await initDatabase();
    const deleted = await deleteSubmission(id);

    if (deleted) {
      return NextResponse.json({ success: true, message: 'Teilnahme gelöscht' });
    } else {
      return NextResponse.json({ error: 'Teilnahme nicht gefunden' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json(
      { error: 'Fehler beim Löschen der Teilnahme' },
      { status: 500 }
    );
  }
}
