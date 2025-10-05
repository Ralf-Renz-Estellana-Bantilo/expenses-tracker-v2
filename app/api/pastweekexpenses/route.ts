import { NextRequest, NextResponse } from 'next/server'
import { createNewDbConnection } from '../../database/db'
import { assertCheckSessionData } from '../helper'

export const POST = async (req: NextRequest) => {
    return assertCheckSessionData(req, async (session) => {
        const db = createNewDbConnection()

        const user = session?.email

        const query = `SELECT * FROM expenses_view exp
         INNER JOIN (
            SELECT 
               DATE(created_on) AS date 
               FROM expenses_view 
                  WHERE created_by = '${user}' 
                  AND DATE(created_on) != CURRENT_DATE() 
                  GROUP BY DATE(created_on) 
                  ORDER BY created_on DESC LIMIT 7) days
            ON DATE(exp.created_on) = DATE(days.date) 
         
         WHERE created_by = '${user}';`
        const result = await db.promise().query(query)

        db.end()
        return NextResponse.json(result[0], { status: 200 })
    })
}
