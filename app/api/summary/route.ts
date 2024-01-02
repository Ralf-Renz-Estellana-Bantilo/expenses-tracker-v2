import { NextResponse } from "next/server"
import { createNewDbConnection } from "../../database/db"

export const POST = async (req: Request, res: Response) => {
  const db = createNewDbConnection()

  const { user } = await req.json()

  const query = `SELECT 
      ROUND(SUM(exp.amount), 2) AS totalExpenses,
	   ROUND((SELECT SUM(wal.amount) FROM wallet_budget wal WHERE created_by = '${user}'), 2) AS totalBudget,
	   (ROUND((SELECT SUM(wal.amount) FROM wallet_budget wal WHERE created_by = '${user}'), 2) - SUM(exp.amount)) AS totalBalance
      FROM expenses_view exp
      WHERE created_by = '${user}';`
  const result = await db.promise().query(query)

  db.end()
  return NextResponse.json(result[0], { status: 200 })
}
