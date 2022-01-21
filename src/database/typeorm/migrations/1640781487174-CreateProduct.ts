import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProduct1640781487174 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "products",
        columns: [
          {
            name: "profile_id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "sku",
            type: "varchar",
          },
          {
            name: "title",
            type: "varchar",
          },
          {
            name: "brand",
            type: "varchar",
          },
          {
            name: "mpn",
            type: "varchar",
          },
          {
            name: "condition",
            type: "varchar",
          },
          {
            name: "manufacturer",
            type: "varchar",
          },
          {
            name: "description",
            type: "varchar",
          },
          {
            name: "upc",
            type: "varchar",
          },
          {
            name: "buy_it_now_price",
            type: "numeric",
          },
          {
            name: "retail_price",
            type: "numeric",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("products");
  }
}
