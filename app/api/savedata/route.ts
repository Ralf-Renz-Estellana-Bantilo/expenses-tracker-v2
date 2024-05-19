import { NextRequest, NextResponse } from "next/server"
import { createNewDbConnection } from "../../database/db"
import { assertCheckSessionData } from "../helper"

/* 
const SAVEDATA_PAYLOAD_SYNTAX = {
   table: 'table_name',
   values: {
      [`column_a`]: `value`,
      [`column_b`]: `value`,
   }
   key?: {
      [`primary_key`]: `ID`,
   }
} 
*/
export const POST = async (req: NextRequest, res: NextResponse) => {
  return assertCheckSessionData(req, async () => {
    const db = createNewDbConnection()

    try {
      const { table, values, key } = await req.json()

      let fieldsNum = []
      let objKeys = Object.keys(values)
      let objValues = Object.values(values)

      for (let a = 0; a < objKeys.length; a++) {
        const item = key ? `${objKeys[a]} = ?` : "?"
        fieldsNum.push(item)
      }

      let query = `INSERT INTO ${table} (${objKeys.join(
        ", "
      )}) VALUES (${fieldsNum.join(", ")})`

      if (key) {
        const primaryKeys: string[] = Object.keys(key)
        const indexing: string[] = []

        for (let a = 0; a < primaryKeys.length; a++) {
          const primaryKey = primaryKeys[a]
          const primaryValue = Object.values(key)[a]

          indexing.push(`${primaryKey} = ${primaryValue}`)
        }

        query = `UPDATE ${table} SET ${fieldsNum.join(
          ", "
        )} WHERE ${indexing.join(" AND ")}`
      }

      const results = await db.promise().query(query, objValues)
      db.end()
      return NextResponse.json(results[0], { status: 200 })
    } catch (err) {
      db.end()
      return NextResponse.json(
        { message: "Error!", data: err },
        { status: 500 }
      )
    }
  })
}
