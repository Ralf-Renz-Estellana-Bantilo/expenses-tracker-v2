import { NextRequest, NextResponse } from "next/server"
import { createNewDbConnection } from "../../database/db"
import { assertCheckSessionData } from "../helper"

export const POST = async (req: NextRequest, res: NextResponse) => {
  return assertCheckSessionData(req, async (session) => {
    const db = createNewDbConnection()

    const user = session?.email

    const { category, month, year, sort, order } = await req.json()
    let sortBy = "ASC"
    let orderBy = "exp.ID"

    let constructedFilterArray = []
    if (category) {
      constructedFilterArray.push(`categoryID IN (${category})`)
    }
    if (month) {
      constructedFilterArray.push(`MONTH(exp.created_on) IN (${month})`)
    }
    if (year) {
      constructedFilterArray.push(`YEAR(exp.created_on) IN (${year})`)
    }
    if (sort) {
      sortBy = sort
    }
    if (order) {
      orderBy = order
    }

    constructedFilterArray.push(`status = 1`)
    constructedFilterArray.push(`created_by = '${user}'`)

    const query = `SELECT * FROM expenses_view exp WHERE ${constructedFilterArray.join(
      " AND "
    )} AND status = 1 ORDER BY ${orderBy} ${sortBy};`

    const result = await db.promise().query(query)

    db.end()
    return NextResponse.json(result[0], { status: 200 })
  })
}
