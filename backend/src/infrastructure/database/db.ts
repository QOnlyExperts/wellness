import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const {
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
} = process.env;

if (!POSTGRES_DB || !POSTGRES_USER || !POSTGRES_PASSWORD || !POSTGRES_HOST || !POSTGRES_PORT) {
  throw new Error('❌ Faltan variables de entorno para la conexión a la base de datos.');
}

const sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
  host: POSTGRES_HOST,
  port: Number(POSTGRES_PORT),
  dialect: 'postgres',
  logging: false, // desactiva logs de SQL
});

// Verificación inicial opcional
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL exitosa.');
  } catch (error: any) {
    console.error('❌ Error al conectar:', error.message);
  }
})();

export default sequelize;
