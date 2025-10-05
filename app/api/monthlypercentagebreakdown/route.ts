import { NextRequest, NextResponse } from 'next/server'
import { createNewDbConnection } from '../../database/db'
import { assertCheckSessionData } from '../helper'

export const POST = async (req: NextRequest) => {
    return assertCheckSessionData(req, async (session) => {
        const db = createNewDbConnection()

        const user = session?.email
        const { monthID, year } = await req.json()

        const query = `SELECT 
        exp.categoryID, 
        exp.category, 
        MONTH(exp.created_on) AS monthID,
        SUM(exp.amount) AS total, 
        mon.total AS monthly_total,
        ROUND(((SUM(exp.amount) / mon.total) * 100), 2) AS percentage,
        exp.created_by 
    
        FROM expenses_view exp
            LEFT JOIN monthly_expenses_view mon
            ON exp.created_by = mon.user AND mon.monthID = MONTH(created_on) AND mon.year = YEAR(created_on)
                WHERE exp.created_by = '${user}'
                AND mon.monthID = '${monthID}'
                AND mon.year = '${year}'
                GROUP BY categoryID;`
        const result = await db.promise().query(query)

        db.end()
        return NextResponse.json(result[0], { status: 200 })
    })
}
