import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("products")
class Product {
  @PrimaryColumn()
  profile_id: string;

  @Column()
  sku: string;

  @Column()
  title: string;

  @Column()
  brand: string;

  @Column()
  manufacturer: string;

  @Column()
  mpn: string;

  @Column()
  condition: string;

  @Column()
  description: string;

  @Column()
  upc: string;

  @Column()
  buy_it_now_price: number;

  @Column()
  retail_price: number;

  constructor() {
    if (!this.profile_id) {
      this.profile_id = uuidV4();
    }
  }
}

export { Product };
