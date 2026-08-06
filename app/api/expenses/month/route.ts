import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/database/supabase'
import { assertCheckSessionData } from '../../helper'

const SORTABLE = new Set(['ID', 'created_on'])

export const GET = async (req: NextRequest) => {
    return assertCheckSessionData(req, async (session) => {
        const user = session?.email
        const { searchParams } = req.nextUrl

        const monthID = Number(searchParams.get('monthID'))
        const year = Number(searchParams.get('year'))
        if (!monthID || !year) {
            return NextResponse.json(
                { message: 'monthID and year are required' },
                { status: 400 }
            )
        }

        const sortByRaw = searchParams.get('sortBy') ?? 'created_on'
        const sortBy = SORTABLE.has(sortByRaw) ? sortByRaw : 'created_on'
        const ascending =
            (searchParams.get('sortDir') ?? 'DESC').toUpperCase() !== 'DESC'

        const { data, error } = await supabaseAdmin
            .from('previous_expenses_view')
            .select('*')
            .eq('created_by', user)
            .eq('status', 1)
            .eq('monthID', monthID)
            .eq('year', year)
            .order(sortBy, { ascending })

        if (error) {
            return NextResponse.json(
                { message: 'Error!', data: error },
                { status: 500 }
            )
        }
        return NextResponse.json(data, { status: 200 })
    })
}
