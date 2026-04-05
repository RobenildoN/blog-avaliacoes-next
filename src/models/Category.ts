import { DataTypes, Model, Sequelize } from "sequelize";

let _Category: any;

export function initCategory(sequelize: Sequelize) {
  if (_Category) return _Category;

  class Category extends Model {
    public id!: number;
    public name!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Category.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    { sequelize, modelName: "Category", tableName: "categories", timestamps: true }
  );

  _Category = Category;
  return Category;
}

export function getCategory() {
  return _Category;
}
