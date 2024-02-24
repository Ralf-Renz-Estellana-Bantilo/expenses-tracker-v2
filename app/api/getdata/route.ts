import { NextResponse } from "next/server"
import { createNewDbConnection } from "../../database/db"

export const GET = async (req: Request, res: Response) => {
  const db = createNewDbConnection()
  try {
    const query = "SELECT * FROM expenses"
    const result = await db.promise().query(query)
    return NextResponse.json(result[0], { status: 200 })
  } catch (err) {
    return NextResponse.json({ message: "Error!", data: err }, { status: 500 })
  }
}
