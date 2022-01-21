import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { Product } from "./Product";

@Entity("attributes")
class Attribute {
  @PrimaryColumn()
  id?: string;

  @Column()
  value: string;

  @Column()
  name: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column()
  product_id: string;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Attribute };
