import { NextRequest, NextResponse } from 'next/server'
import { createNewDbConnection } from '../../database/db'
import { assertCheckSessionData } from '../helper'

export const GET = async (req: NextRequest) => {
    return assertCheckSessionData(req, async () => {
        const db = createNewDbConnection()
        try {
            const query = 'SELECT * FROM expenses'
            const result = await db.promise().query(query)
            db.end()
            return NextResponse.json(result[0], { status: 200 })
        } catch (err) {
            db.end()
            return NextResponse.json(
                { message: 'Error!', data: err },
                { status: 500 }
            )
        }
    })
}
