import { Entity, DbType } from "../src/types";
import { DbContext } from "../src/db-context";
import { context } from "../src/model-builder";

describe("Metadata测试", () => {
  it("测试", () => {
    /*************************试验代码****************************/
    class X extends Entity {
      str: string;
      date: Date;
      y: Y;
      ys: Y[];
    }

    class Y extends Entity {
      x: X;
      xs: X[];
    }

    class DB extends DbContext {}

    context(DB, (modelBuilder) => {
      modelBuilder.entity(X).asTable((builder) => {
        builder.column((p) => p.str, String);
        builder.hasMany((p) => p.ys, Y).withOne();
        builder
          .hasOne((p) => p.y, Y)
          .withOne((p) => p.x)
          .hasForeignKey()
          .constraintName("abc");

        builder
          .hasMany((p) => p.ys, Y)
          .withMany((p) => p.xs)
          .hasTable("abc", (builder) => {
            // 声明主键
            builder.hasKey((p) => p.Id);
            builder
              .column((p) => p.id, Number)
              .dbType(DbType.int64)
              .identity();
            builder.column((p) => p.xId, Number);
            builder.column((p) => p.yId, Number);
            // 建立x关系
            builder.hasMany((p) => p.xs, X).withOne();
            // 建立y关系
            builder.hasMany((p) => p.y, Y).withOne();
          });
      });
    });
  });
});
