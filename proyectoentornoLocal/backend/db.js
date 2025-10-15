import sql from 'mssql';

const config = {
  user: 'sa',
  password: '123',
  server: 'DESKTOP-IPM9M81\\MSQLSERVER2', // Doble backslash
  database: 'DonaBeny', // pon aquí el nombre real de tu base de datos
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export async function getConnection() {
  try {
    const pool = await sql.connect(config);
    console.log('✅ Conectado correctamente a la BD');
    return pool;
  } catch (err) {
    console.error('❌ Error al conectar a la BD:', err);
  }
}
