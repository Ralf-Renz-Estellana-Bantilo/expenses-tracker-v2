import { NextRequest, NextResponse } from 'next/server'
import { createNewDbConnection } from '../../database/db'
import { assertCheckSessionData } from '../helper'

export const POST = async (req: NextRequest) => {
    return assertCheckSessionData(req, async (session) => {
        const db = createNewDbConnection()

        const { searchText } = await req.json()

        const user = session?.email

        try {
            const query = `SELECT * FROM expenses_view WHERE (description LIKE '%${searchText}%' OR category LIKE '%${searchText}%') AND status=1 AND created_by = '${user}';`
            const result = await db.promise().query(query)
            return NextResponse.json(result[0], { status: 200 })
        } catch (err) {
            return NextResponse.json(
                { message: 'Error!', data: err },
                { status: 500 }
            )
        }
    })
}
