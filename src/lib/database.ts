import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

let sequelize: Sequelize;
let synced = false;

const dialect =
  (process.env.DB_DIALECT as "mysql" | "postgres" | "sqlite") || "sqlite";

if (dialect === "sqlite") {
  // Configuração para SQLite (mais simples para desenvolvimento)
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.DB_STORAGE || "./database.sqlite",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
  });
} else {
  // Configuração para MySQL/PostgreSQL
  sequelize = new Sequelize(
    process.env.DB_NAME || "blog_avaliacoes",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST || "localhost",
      dialect: dialect,
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

// Testar conexão
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados estabelecida com sucesso.");

    if (!synced) {
      await sequelize.sync();
      synced = true;
      console.log("Tabelas sincronizadas com o banco de dados.");
    }
  } catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error);
    throw error;
  }
};

export default sequelize;
