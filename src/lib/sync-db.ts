import sequelize from './database';
import { setupAssociations } from '../models/associations';

export const syncDatabase = async () => {
  try {
    // Configurar associações
    setupAssociations();

    // Sincronizar todas as tabelas com force: true para recriar se necessário
    await sequelize.sync({ force: true });

    console.log('✅ Banco de dados sincronizado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco de dados:', error);
    throw error;
  }
};

// Executar sincronização se este arquivo for executado diretamente
if (require.main === module) {
  syncDatabase()
    .then(() => {
      console.log('🎉 Sincronização concluída!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erro na sincronização:', error);
      process.exit(1);
    });
}