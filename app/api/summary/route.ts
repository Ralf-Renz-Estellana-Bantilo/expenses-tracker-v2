import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../database/supabase'
import { assertCheckSessionData } from '../helper'

export const POST = async (req: NextRequest) => {
    return assertCheckSessionData(req, async (session) => {
        const user = session?.email
        const { data, error } = await supabaseAdmin.rpc('summary_totals', {
            p_user: user,
        })
        if (error) {
            return NextResponse.json(
                { message: 'Error!', data: error },
                { status: 500 }
            )
        }
        return NextResponse.json(data, { status: 200 })
    })
}
