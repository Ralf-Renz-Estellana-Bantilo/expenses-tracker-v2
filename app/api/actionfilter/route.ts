import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../database/supabase'
import { assertCheckSessionData } from '../helper'
import { TActionFilterPayload } from '@/app/controller/controller'
import { SORTABLE_COLUMNS } from '../allowlist'

export const POST = async (req: NextRequest) => {
    return assertCheckSessionData(req, async (session) => {
        const user = session?.email
        const {
            category,
            sort,
            order,
            dateStart,
            dateEnd,
        }: TActionFilterPayload = await req.json()

        const orderColumnRaw = order || 'ID'
        const orderColumn = SORTABLE_COLUMNS.has(orderColumnRaw)
            ? orderColumnRaw.replace(/^exp\./, '')
            : 'ID'
        const ascending = String(sort || 'ASC').toUpperCase() !== 'DESC'

        let query = supabaseAdmin
            .from('expenses_view')
            .select('*')
            .eq('status', 1)
            .eq('created_by', user)

        if (category) {
            const ids = String(category)
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            if (ids.length > 0) {
                query = query.in('categoryID', ids)
            }
        }

        if (dateStart && dateEnd) {
            query = query
                .gte('created_on', `${dateStart} 00:00:00+08`)
                .lte('created_on', `${dateEnd} 23:59:59+08`)
        }

        query = query.order(orderColumn, { ascending })

        const { data, error } = await query
        if (error) {
            return NextResponse.json(
                { message: 'Error!', data: error },
                { status: 500 }
            )
        }
        return NextResponse.json(data, { status: 200 })
    })
}
