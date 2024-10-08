import { NextRequest, NextResponse } from "next/server"
import { createNewDbConnection } from "../../database/db"
import { MasterSelectPayload } from "@/app/types/type"
import { assertCheckSessionData } from "../helper"

/* 
const MASTERSELECT_PAYLOAD_SYNTAX = {
   table: 'table_name',
   column?: 'column_a, column_b, column_c',
   filter?: {
      [`column_a`]: `value`
   },
   sort?: {
      [`column_a`]: 'ASC' || 'DESC'
   }
} 
*/
export const POST = async (req: NextRequest) => {
  return assertCheckSessionData(req, async () => {
    const db = createNewDbConnection()

    try {
      const { table, column, filter, sort }: MasterSelectPayload =
        await req.json()

      let filterData = "1"
      let columnData = "*"
      let sortData = ";"

      if (filter) {
        if (Object.keys(filter).length > 0) {
          const filterKeys = Object.keys(filter)
          const filterValues = Object.values(filter)

          let result = []
          for (let a = 0; a < filterKeys.length; a++) {
            const holdResult = `${filterKeys[a]} = '${filterValues[a]}'`
            result.push(holdResult)
          }
          let construct = result.join(" AND ")
          filterData = construct
        }
      }

      if (column) {
        if (Object.keys(column).length > 0) {
          columnData = [...new Set(column)].join(",")
        }
      }

      if (sort) {
        if (Object.keys(sort).length > 0) {
          let orderBy = []
          for (let a = 0; a < Object.keys(sort).length; a++) {
            const key = Object.keys(sort)[a]
            const value = Object.values(sort)[a]
            orderBy.push(`${key} ${value}`)
          }
          const construct = "ORDER BY " + orderBy.join(", ")
          sortData = construct
        }
      }

      const query = `SELECT ${columnData} FROM ${table} WHERE ${filterData} ${sortData}`

      const results = await db.promise().query(query)
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
