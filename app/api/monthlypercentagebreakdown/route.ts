import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../database/supabase'
import { assertCheckSessionData } from '../helper'

export const POST = async (req: NextRequest) => {
    return assertCheckSessionData(req, async (session) => {
        const user = session?.email
        const { monthID, year } = await req.json()

        const { data, error } = await supabaseAdmin.rpc(
            'monthly_percentage_breakdown',
            {
                p_user: user,
                p_month: Number(monthID),
                p_year: Number(year),
            }
        )
        if (error) {
            return NextResponse.json(
                { message: 'Error!', data: error },
                { status: 500 }
            )
        }
        return NextResponse.json(data, { status: 200 })
    })
}
