import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const SESSION_TOKEN = 'rc_admin_session_2025';
const CONFIG_FILE = join(process.cwd(), 'smtp-config.json');

interface SMTPConfig {
  host: string;
  port: string;
  user: string;
  pass: string;
  secure: boolean;
  from: string;
}

function isAuthenticated(request: NextRequest): boolean {
  const session = request.cookies.get('admin_session');
  return session?.value === SESSION_TOKEN;
}

function getConfig(): SMTPConfig {
  // First check environment variables
  if (process.env.SMTP_HOST) {
    return {
      host: process.env.SMTP_HOST || '',
      port: process.env.SMTP_PORT || '587',
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
      secure: process.env.SMTP_SECURE === 'true',
      from: process.env.SMTP_FROM || 'noreply@realcore.de',
    };
  }
  
  // Fallback to config file
  if (existsSync(CONFIG_FILE)) {
    try {
      const data = readFileSync(CONFIG_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      // Return empty config if file is invalid
    }
  }
  
  return {
    host: '',
    port: '587',
    user: '',
    pass: '',
    secure: false,
    from: 'noreply@realcore.de',
  };
}

function saveConfig(config: SMTPConfig): void {
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }

  const config = getConfig();
  
  // Don't send the actual password for security
  return NextResponse.json({
    host: config.host,
    port: config.port,
    user: config.user,
    pass: config.pass ? '••••••••' : '',
    secure: config.secure,
    from: config.from,
    isEnvConfigured: !!process.env.SMTP_HOST,
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    const config: SMTPConfig = {
      host: data.host || '',
      port: data.port || '587',
      user: data.user || '',
      pass: data.pass || '',
      secure: data.secure === true || data.secure === 'true',
      from: data.from || 'noreply@realcore.de',
    };

    saveConfig(config);

    return NextResponse.json({ 
      success: true, 
      message: 'Konfiguration gespeichert' 
    });
  } catch (error) {
    console.error('Config save error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Speichern der Konfiguration' },
      { status: 500 }
    );
  }
}
