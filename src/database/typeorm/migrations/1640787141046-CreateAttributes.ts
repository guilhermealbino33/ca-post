import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAttributes1640787141046 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "attributes",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "value",
            type: "varchar",
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "unit",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "product_id",
            type: "uuid",
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: "FKAttributeProduct",
            referencedTableName: "products",
            referencedColumnNames: ["profile_id"],
            columnNames: ["product_id"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("attributes");
  }
}
