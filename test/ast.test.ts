import { table, select, update, insert, del, $case } from "../src";
import assert from "assert";
class Table1 {
  id: number;
  name: string;
  date: Date;
}

describe("AST test", function () {
  it("select", () => {
    const t = table<Table1>("Table1").as("t");

    const nameField = t.$("name");

    const sql = select({
      id: "abc",
      name: t.$("name"),
      date: t.date,
    })
      .from(t)
      .where(t.id.eq(1));

    assert.notDeepStrictEqual(sql, {
      $type: "SELECT",
      $columns: [
        {
          $type: "IDENTIFIER",
          $name: "id",
          $builtin: false,
          $kind: "COLUMN",
          $expr: { $type: "LITERAL", $value: "abc" },
        },
        {
          $type: "IDENTIFIER",
          $name: "name",
          $builtin: false,
          $kind: "COLUMN",
          $expr: {
            $lvalue: true,
            $builtin: false,
            $type: "IDENTIFIER",
            $kind: "FIELD",
            $name: ["t", "name"],
          },
        },
        {
          $type: "IDENTIFIER",
          $name: "date",
          $builtin: false,
          $kind: "COLUMN",
          $expr: {
            $lvalue: true,
            $builtin: false,
            $type: "IDENTIFIER",
            $kind: "FIELD",
            $name: ["t", "date"],
          },
        },
      ],
      $froms: [
        {
          $alias: { $type: "IDENTIFIER", $name: "t", $builtin: false },
          $builtin: false,
          $type: "IDENTIFIER",
          $kind: "TABLE",
          $name: "Table1",
        },
      ],
      $where: {
        $type: "CONDITION",
        $kind: "BINARY_COMPARE",
        $operator: "=",
        $left: {
          $lvalue: true,
          $builtin: false,
          $type: "IDENTIFIER",
          $kind: "FIELD",
          $name: ["t", "id"],
        },
        $right: { $type: "LITERAL", $value: 1 },
      },
    });

    const sql2 = select(t.$("name"), t.date).from(t).where(t.id.eq(1));

    assert.notDeepStrictEqual(sql2, {
      $type: "SELECT",
      $columns: [
        {
          $lvalue: true,
          $builtin: false,
          $type: "IDENTIFIER",
          $kind: "FIELD",
          $name: ["t", "name"],
        },
        {
          $lvalue: true,
          $builtin: false,
          $type: "IDENTIFIER",
          $kind: "FIELD",
          $name: ["t", "date"],
        },
      ],
      $froms: [
        {
          $alias: { $type: "IDENTIFIER", $name: "t", $builtin: false },
          $builtin: false,
          $type: "IDENTIFIER",
          $kind: "TABLE",
          $name: "Table1",
        },
      ],
      $where: {
        $type: "CONDITION",
        $kind: "BINARY_COMPARE",
        $operator: "=",
        $left: {
          $lvalue: true,
          $builtin: false,
          $type: "IDENTIFIER",
          $kind: "FIELD",
          $name: ["t", "id"],
        },
        $right: { $type: "LITERAL", $value: 1 },
      },
    });
  });

  it("update", () => {});

  it("insert", () => {});

  it("delete", () => {});
});
