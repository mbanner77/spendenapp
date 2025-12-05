import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { readFileSync, existsSync } from 'fs';
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

function getConfig(): SMTPConfig | null {
  // First check environment variables
  if (process.env.SMTP_HOST) {
    return {
      host: process.env.SMTP_HOST,
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
      return null;
    }
  }
  
  return null;
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }

  try {
    const { recipient } = await request.json();

    if (!recipient) {
      return NextResponse.json(
        { error: 'Bitte geben Sie eine Empfänger-E-Mail-Adresse an' },
        { status: 400 }
      );
    }

    const config = getConfig();

    if (!config || !config.host) {
      return NextResponse.json(
        { error: 'SMTP ist nicht konfiguriert. Bitte speichern Sie zuerst die Konfiguration.' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: parseInt(config.port),
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    // Test the connection first
    await transporter.verify();

    // Send test email
    await transporter.sendMail({
      from: config.from,
      to: recipient,
      subject: '🎄 RealCore Spendenapp - Test-E-Mail',
      text: `Dies ist eine Test-E-Mail von der RealCore Spendenapp.

Wenn Sie diese E-Mail erhalten haben, ist Ihre SMTP-Konfiguration korrekt eingerichtet.

---
Gesendet am: ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e3a5f 0%, #1a472a 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
    .footer { background: #1e3a5f; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
    .success-box { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🎄 RealCore Spendenapp</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Test-E-Mail</p>
    </div>
    <div class="content">
      <div class="success-box">
        <strong>✅ Erfolg!</strong><br>
        Ihre SMTP-Konfiguration ist korrekt eingerichtet.
      </div>
      <p>Diese Test-E-Mail wurde erfolgreich über Ihren SMTP-Server versendet.</p>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        📅 ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}
      </p>
    </div>
    <div class="footer">
      © 2025 RealCore Group GmbH
    </div>
  </div>
</body>
</html>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      message: `Test-E-Mail erfolgreich an ${recipient} gesendet` 
    });

  } catch (error: any) {
    console.error('Test email error:', error);
    
    let errorMessage = 'Fehler beim Senden der Test-E-Mail';
    
    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Verbindung zum SMTP-Server fehlgeschlagen. Bitte überprüfen Sie Host und Port.';
    } else if (error.code === 'EAUTH') {
      errorMessage = 'Authentifizierung fehlgeschlagen. Bitte überprüfen Sie Benutzername und Passwort.';
    } else if (error.message) {
      errorMessage = `SMTP-Fehler: ${error.message}`;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
