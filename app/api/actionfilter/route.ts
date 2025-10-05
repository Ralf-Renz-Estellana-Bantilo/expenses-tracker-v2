import { NextRequest, NextResponse } from 'next/server'
import { createNewDbConnection } from '../../database/db'
import { assertCheckSessionData } from '../helper'
import { TActionFilterPayload } from '@/app/controller/controller'

export const POST = async (req: NextRequest) => {
    return assertCheckSessionData(req, async (session) => {
        const db = createNewDbConnection()

        const user = session?.email

        const {
            category,
            sort,
            order,
            dateStart,
            dateEnd,
        }: TActionFilterPayload = await req.json()
        let sortBy = 'ASC'
        let orderBy = 'exp.ID'

        let constructedFilterArray = []
        if (category) {
            constructedFilterArray.push(`categoryID IN (${category})`)
        }
        if (sort) {
            sortBy = sort
        }
        if (order) {
            orderBy = order
        }

        if (dateStart && dateEnd) {
            constructedFilterArray.push(
                `DATE(exp.created_on) BETWEEN DATE('${dateStart}') AND DATE('${dateEnd}')`
            )
        }

        constructedFilterArray.push(`status = 1`)
        constructedFilterArray.push(`created_by = '${user}'`)

        const query = `SELECT * FROM expenses_view exp WHERE ${constructedFilterArray.join(
            ' AND '
        )} ORDER BY ${orderBy} ${sortBy};`

        const result = await db.promise().query(query)

        db.end()
        return NextResponse.json(result[0], { status: 200 })
    })
}
