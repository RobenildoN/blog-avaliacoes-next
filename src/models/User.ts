import { DataTypes, Model, Sequelize } from "sequelize";

let _User: any;

export function initUser(sequelize: Sequelize) {
  if (_User) return _User;

  class User extends Model {
    public id!: number;
    public email!: string;
    public password!: string;
    public name?: string;
    public role!: "admin" | "user";
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  User.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
      password: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: true },
      role: { type: DataTypes.ENUM("admin", "user"), allowNull: false, defaultValue: "user" },
    },
    { sequelize, modelName: "User", tableName: "users", timestamps: true }
  );

  _User = User;
  return User;
}

export function getUser() {
  return _User;
}
