import mysql from 'mysql2/promise';

// Configuración de la base de datos
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'huv_medical',
    port: parseInt(process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Pool de conexiones
let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
    if (!pool) {
        pool = mysql.createPool(dbConfig);
    }
    return pool;
}

// Función helper para ejecutar queries
export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
    const pool = getPool();
    const [results] = await pool.execute(sql, params);
    return results as T;
}

// Cerrar el pool (útil para testing o shutdown)
export async function closePool(): Promise<void> {
    if (pool) {
        await pool.end();
        pool = null;
    }
}
