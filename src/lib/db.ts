import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Initialize database schema
export async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        firma VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        spendenauswahl VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database schema initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Submission interface
export interface Submission {
  id?: number;
  name: string;
  firma: string;
  position: string;
  email: string;
  spendenauswahl: string;
  created_at?: Date;
}

// Insert a new submission
export async function insertSubmission(submission: Omit<Submission, 'id' | 'created_at'>): Promise<Submission> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO submissions (name, firma, position, email, spendenauswahl)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [submission.name, submission.firma, submission.position, submission.email, submission.spendenauswahl]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

// Get all submissions
export async function getSubmissions(): Promise<Submission[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM submissions ORDER BY created_at DESC'
    );
    return result.rows;
  } finally {
    client.release();
  }
}

// Get submission statistics
export interface SubmissionStats {
  total: number;
  lichtblicke: number;
  diospiSuyana: number;
  todayCount: number;
  thisWeekCount: number;
}

export async function getSubmissionStats(): Promise<SubmissionStats> {
  const client = await pool.connect();
  try {
    const totalResult = await client.query('SELECT COUNT(*) as count FROM submissions');
    const lichtblickeResult = await client.query(
      "SELECT COUNT(*) as count FROM submissions WHERE spendenauswahl = 'lichtblicke'"
    );
    const diospiResult = await client.query(
      "SELECT COUNT(*) as count FROM submissions WHERE spendenauswahl = 'diospi-suyana'"
    );
    const todayResult = await client.query(
      "SELECT COUNT(*) as count FROM submissions WHERE created_at >= CURRENT_DATE"
    );
    const weekResult = await client.query(
      "SELECT COUNT(*) as count FROM submissions WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'"
    );

    return {
      total: parseInt(totalResult.rows[0].count),
      lichtblicke: parseInt(lichtblickeResult.rows[0].count),
      diospiSuyana: parseInt(diospiResult.rows[0].count),
      todayCount: parseInt(todayResult.rows[0].count),
      thisWeekCount: parseInt(weekResult.rows[0].count),
    };
  } finally {
    client.release();
  }
}

// Delete a submission
export async function deleteSubmission(id: number): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM submissions WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  } finally {
    client.release();
  }
}

// Export submissions as CSV
export async function exportSubmissionsCSV(): Promise<string> {
  const submissions = await getSubmissions();
  
  const headers = ['ID', 'Name', 'Firma', 'Position', 'E-Mail', 'Spendenauswahl', 'Datum'];
  const rows = submissions.map(s => [
    s.id,
    `"${s.name}"`,
    `"${s.firma}"`,
    `"${s.position}"`,
    s.email,
    s.spendenauswahl === 'lichtblicke' ? 'Lichtblicke e.V.' : 'Diospi Suyana',
    new Date(s.created_at!).toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })
  ]);

  return [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
}

export default pool;
