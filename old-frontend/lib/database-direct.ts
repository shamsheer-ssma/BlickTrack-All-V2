/**
 * Direct Database Connection
 * 
 * This file provides direct PostgreSQL database access for admin APIs
 * when backend API endpoints are not available.
 * 
 * @author BlickTrack Development Team
 * @version 1.0.0
 * @created 2025-10-02
 */

import { Pool } from 'pg';

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://btdbuname:btdbpwd@localhost:6000/bt-db-sep26?schema=public',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('✅ [DATABASE] Direct connection successful');
    return true;
  } catch (error) {
    console.error('❌ [DATABASE] Direct connection failed:', error);
    return false;
  }
}

// Get database connection
export async function getConnection() {
  return await pool.connect();
}

// Execute query
export async function query(sql: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result;
  } finally {
    client.release();
  }
}

// Close all connections
export async function closeConnections() {
  await pool.end();
  console.log('✅ [DATABASE] All connections closed');
}

