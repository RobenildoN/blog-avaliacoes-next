import { Sequelize } from "sequelize";
import sqlite3 from "sqlite3";

let sequelize: Sequelize | null = null;
let synced = false;

export function getSequelize(): Sequelize {
  if (sequelize) return sequelize;

  const dialect =
    (process.env.DB_DIALECT as "mysql" | "postgres" | "sqlite") || "sqlite";

  if (dialect === "sqlite") {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: process.env.DB_STORAGE || "./database.sqlite",
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      dialectModule: sqlite3,
    });
  } else {
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
      },
    );
  }

  return sequelize;
}

export const connectDB = async () => {
  const db = getSequelize();
  try {
    await db.authenticate();
    console.log("Conexão com o banco de dados estabelecida com sucesso.");

    if (!synced) {
      await db.sync();
      synced = true;
      console.log("Tabelas sincronizadas com o banco de dados.");
    }
  } catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error);
    throw error;
  }
};
