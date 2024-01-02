import { NextResponse } from "next/server"
import { createNewDbConnection } from "../../database/db"

export const POST = async (req: Request, res: Response) => {
  const db = createNewDbConnection()

  const { user } = await req.json()

  const query = `SELECT 
      mon.user as user,
      ROUND(SUM(mon.total) / COUNT(mon.user), 2) AS monthly_average 
      FROM monthly_expenses_view mon
         WHERE mon.year = YEAR(CURRENT_DATE())
         AND mon.monthID != MONTH(CURRENT_DATE())
         AND mon.user = '${user}';`
  const result = await db.promise().query(query)

  db.end()
  return NextResponse.json(result[0], { status: 200 })
}
