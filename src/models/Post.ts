import { DataTypes, Model, Sequelize } from "sequelize";

let _Post: any;

export function initPost(sequelize: Sequelize) {
  if (_Post) return _Post;

  class Post extends Model {
    public id!: number;
    public titulo!: string;
    public imagem?: string;
    public resumo!: string;
    public avaliacao!: number;
    public data_post!: Date;
    public categoryId!: number;
    public lido_ate?: string;
    public finalizado!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly Category?: any;
  }

  Post.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      titulo: { type: DataTypes.STRING, allowNull: false },
      imagem: { type: DataTypes.STRING, allowNull: true },
      resumo: { type: DataTypes.TEXT, allowNull: false },
      avaliacao: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0, max: 5 } },
      data_post: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      categoryId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "categories", key: "id" } },
      lido_ate: { type: DataTypes.STRING, allowNull: true },
      finalizado: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { sequelize, modelName: "Post", tableName: "posts", timestamps: true }
  );

  _Post = Post;
  return Post;
}

export function getPost() {
  return _Post;
}
