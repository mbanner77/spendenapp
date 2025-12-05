import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Initialize translations table if it doesn't exist
async function initTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS translations (
        id SERIAL PRIMARY KEY,
        language VARCHAR(5) NOT NULL,
        key VARCHAR(255) NOT NULL,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(language, key)
      )
    `);
  } catch (error) {
    console.error('Error creating translations table:', error);
  }
}

// GET - Fetch all custom translations
export async function GET(request: Request) {
  await initTable();
  
  const { searchParams } = new URL(request.url);
  const language = searchParams.get('language');
  
  try {
    let query = 'SELECT language, key, value FROM translations';
    const params: string[] = [];
    
    if (language) {
      query += ' WHERE language = $1';
      params.push(language);
    }
    
    query += ' ORDER BY language, key';
    
    const result = await pool.query(query, params);
    
    // Convert to object format
    const translations: Record<string, Record<string, string>> = {};
    result.rows.forEach((row: { language: string; key: string; value: string }) => {
      if (!translations[row.language]) {
        translations[row.language] = {};
      }
      translations[row.language][row.key] = row.value;
    });
    
    return NextResponse.json({ success: true, translations });
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

// POST - Save a translation
export async function POST(request: Request) {
  await initTable();
  
  try {
    const { language, key, value } = await request.json();
    
    if (!language || !key) {
      return NextResponse.json({ success: false, error: 'Language and key are required' }, { status: 400 });
    }
    
    // Upsert the translation
    await pool.query(`
      INSERT INTO translations (language, key, value, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (language, key) 
      DO UPDATE SET value = $3, updated_at = CURRENT_TIMESTAMP
    `, [language, key, value]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving translation:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

// DELETE - Delete a custom translation (revert to default)
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get('language');
  const key = searchParams.get('key');
  
  if (!language || !key) {
    return NextResponse.json({ success: false, error: 'Language and key are required' }, { status: 400 });
  }
  
  try {
    await pool.query('DELETE FROM translations WHERE language = $1 AND key = $2', [language, key]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting translation:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
