import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Initialize pages table if it doesn't exist
async function initTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(100) NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    console.error('Error creating pages table:', error);
  }
}

// GET - Fetch a page by slug
export async function GET(request: Request) {
  await initTable();
  
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  
  try {
    if (slug) {
      const result = await pool.query(
        'SELECT slug, title, content, updated_at FROM pages WHERE slug = $1',
        [slug]
      );
      
      if (result.rows.length === 0) {
        return NextResponse.json({ success: true, page: null });
      }
      
      return NextResponse.json({ success: true, page: result.rows[0] });
    } else {
      // Return all pages
      const result = await pool.query(
        'SELECT slug, title, content, updated_at FROM pages ORDER BY slug'
      );
      return NextResponse.json({ success: true, pages: result.rows });
    }
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

// POST - Save a page
export async function POST(request: Request) {
  await initTable();
  
  try {
    const { slug, title, content } = await request.json();
    
    if (!slug || !title) {
      return NextResponse.json({ success: false, error: 'Slug and title are required' }, { status: 400 });
    }
    
    // Upsert the page
    await pool.query(`
      INSERT INTO pages (slug, title, content, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (slug) 
      DO UPDATE SET title = $2, content = $3, updated_at = CURRENT_TIMESTAMP
    `, [slug, title, content || '']);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving page:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}
