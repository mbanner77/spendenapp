import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { insertSubmission, initDatabase } from '../../../lib/db';

const CONFIG_FILE = join(process.cwd(), 'smtp-config.json');

interface SMTPConfig {
  host: string;
  port: string;
  user: string;
  pass: string;
  secure: boolean;
  from: string;
}

function getSMTPConfig(): SMTPConfig | null {
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
      const config = JSON.parse(data);
      if (config.host) {
        return config;
      }
    } catch {
      // Return null if file is invalid
    }
  }
  
  return null;
}

interface FormData {
  name: string;
  firma: string;
  position: string;
  email: string;
  spendenauswahl: string;
  teilnahmebedingungen: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const data: FormData = await request.json();

    // Validate required fields
    if (!data.name || !data.firma || !data.position || !data.email || !data.spendenauswahl || !data.teilnahmebedingungen) {
      return NextResponse.json(
        { error: 'Alle Pflichtfelder müssen ausgefüllt sein' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      );
    }

    // Format the donation selection for readability
    const spendenOrganisation = data.spendenauswahl === 'lichtblicke' 
      ? 'Lichtblicke e.V.' 
      : 'Diospi Suyana - Krankenhaus in Peru';

    // Create email content
    const emailContent = `
Neue Gewinnspiel-Teilnahme eingegangen
======================================

Persönliche Daten:
------------------
Name: ${data.name}
Firma: ${data.firma}
Position: ${data.position}
E-Mail: ${data.email}

Spendenauswahl:
---------------
${spendenOrganisation}

Teilnahmebedingungen akzeptiert: Ja

---
Zeitstempel: ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}
    `.trim();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e3a5f 0%, #1a472a 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .footer { background: #1e3a5f; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
    .field { margin-bottom: 10px; }
    .label { font-weight: bold; color: #1e3a5f; }
    .value { margin-left: 10px; }
    .donation-box { background: #d4af37; color: #1e3a5f; padding: 15px; border-radius: 5px; margin: 15px 0; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🎄 Neue Gewinnspiel-Teilnahme</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">RealCore Weihnachtsspende 2025</p>
    </div>
    <div class="content">
      <h2 style="color: #1e3a5f; margin-top: 0;">Persönliche Daten</h2>
      <div class="field"><span class="label">Name:</span><span class="value">${data.name}</span></div>
      <div class="field"><span class="label">Firma:</span><span class="value">${data.firma}</span></div>
      <div class="field"><span class="label">Position:</span><span class="value">${data.position}</span></div>
      <div class="field"><span class="label">E-Mail:</span><span class="value"><a href="mailto:${data.email}">${data.email}</a></span></div>
      
      <div class="donation-box">
        🎁 Gewählte Spendenorganisation: ${spendenOrganisation}
      </div>
      
      <p style="color: #666; font-size: 12px;">
        ✅ Teilnahmebedingungen akzeptiert<br>
        📅 ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}
      </p>
    </div>
    <div class="footer">
      © 2025 RealCore Group GmbH - Weihnachtsspende Gewinnspiel
    </div>
  </div>
</body>
</html>
    `.trim();

    // Save to database if DATABASE_URL is configured
    if (process.env.DATABASE_URL) {
      try {
        await initDatabase();
        await insertSubmission({
          name: data.name,
          firma: data.firma,
          position: data.position,
          email: data.email,
          spendenauswahl: data.spendenauswahl,
        });
        console.log('Submission saved to database');
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue even if database fails - we'll still try to send email
      }
    }

    // Try to send email if SMTP is configured (via env vars or config file)
    const smtpConfig = getSMTPConfig();
    
    if (smtpConfig) {
      const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: parseInt(smtpConfig.port),
        secure: smtpConfig.secure,
        auth: {
          user: smtpConfig.user,
          pass: smtpConfig.pass,
        },
      });

      await transporter.sendMail({
        from: smtpConfig.from,
        to: 'events@realcore.de',
        subject: `🎄 Neue Gewinnspiel-Teilnahme: ${data.name} - ${data.firma}`,
        text: emailContent,
        html: htmlContent,
      });

      console.log('Email sent successfully to events@realcore.de');
    } else {
      // Log the submission for development purposes
      console.log('=== NEW SUBMISSION (Email not configured) ===');
      console.log(emailContent);
      console.log('============================================');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Vielen Dank für Ihre Teilnahme!' 
    });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.' },
      { status: 500 }
    );
  }
}
