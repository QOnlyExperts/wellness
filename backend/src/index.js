const app = require('./app');
const sequelize = require('./infrastructure/database/db');

const main = async() => {

  (async () => {
    try {
      await sequelize.authenticate();
      console.log('✅ Modelos cargados y base conectada.');
    } catch (error) {
      console.error('❌ Error al conectar o cargar modelos:', error.message);
    }
  })();

  app.listen(4000);
  console.log("Backend de Bienestar funcionando 🚀 piupiu");
}

main();


// console.log("🔥 Probando sincronización en Docker");
