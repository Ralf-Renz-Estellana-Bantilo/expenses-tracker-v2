import { NextRequest, NextResponse } from "next/server"
import { createNewDbConnection } from "../../database/db"
import { assertCheckSessionData } from "../helper"

export const POST = async (req: NextRequest, res: NextResponse) => {
  return assertCheckSessionData(req, async (session) => {
    const db = createNewDbConnection()

    const user = session?.email

    const query = `SELECT 
        ROUND(COUNT(amount), 2) AS numberOfDays,
        ROUND(SUM(amount), 2) AS totalExpenses,
        ROUND((SUM(amount) / COUNT(amount)), 2) AS dailyAverage 
        FROM daily_expenses_view 
           WHERE YEAR(created_on) = YEAR(CURRENT_DATE())
           AND created_by = '${user}';`
    const result = await db.promise().query(query)

    db.end()
    return NextResponse.json(result[0], { status: 200 })
  })
}
