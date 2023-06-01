import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Col } from "sequelize/types/utils";

@Table({
    tableName: "products",
    timestamps: false,
})
export default class ProductModel extends Model {
    @PrimaryKey
    @Column
    declare id: string;

    @Column({ allowNull: false })
    declare name: string;

    @Column({ allowNull: false })
    declare price: number; 
}