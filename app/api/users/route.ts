import { NextRequest, NextResponse } from 'next/server'
import { assertCheckSessionData } from '../helper'
import { createNewDbConnection } from '@/app/database/db'

export const POST = async (req: NextRequest) => {
    return assertCheckSessionData(req, async (session) => {
        const db = createNewDbConnection()

        const user = session?.email

        try {
            const query = `SELECT * FROM users WHERE email = '${user}';`
            const result = await db.promise().query(query)
            return NextResponse.json(result[0], { status: 200 })
        } catch (err) {
            return NextResponse.json(
                { message: 'Unauthorized user!', data: err },
                { status: 500 }
            )
        }
    })
}
