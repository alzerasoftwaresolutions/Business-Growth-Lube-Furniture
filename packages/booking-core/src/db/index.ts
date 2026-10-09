import { Pool, PoolClient } from 'pg';
import { config } from '../config';
import { logger } from '../utils/logger';

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
  max: config.DB_POOL_MAX,
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle PostgreSQL client', { error: err.message });
});

export async function withTransaction<T>(
  tenantId: string | null,
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (tenantId) {
      // Validate UUID format to prevent SQL injection or malformed session context
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(tenantId)) {
        throw new Error(`Invalid tenantId format for transaction context: ${tenantId}`);
      }
      // Set PostgreSQL session variable local to transaction (is_local = true)
      await client.query("SELECT set_config('app.current_tenant_id', $1, true)", [tenantId]);
    }
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    try {
      // Connection-Pool Leakage Defense: Explicitly reset session variable before returning client to pool
      await client.query("SELECT set_config('app.current_tenant_id', '', false)");
    } catch (resetErr) {
      logger.warn('Failed to reset app.current_tenant_id on connection release', {
        error: (resetErr as Error).message,
      });
    }
    client.release();
  }
}
