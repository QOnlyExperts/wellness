import httpServer from './app';
import sequelize from './infrastructure/database/db';

const main = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Modelos cargados y base conectada.');
  } catch (error: any) {
    console.error('❌ Error al conectar o cargar modelos:', error.message);
  }

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`Backend de Bienestar funcionando 🚀 (Puerto: ${PORT})`);
  });
};

main();

// console.log("🔥 Probando sincronización en Docker");
