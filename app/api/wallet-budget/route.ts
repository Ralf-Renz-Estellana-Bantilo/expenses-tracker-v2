import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/database/supabase'
import { assertCheckSessionData } from '../helper'

export const GET = async (req: NextRequest) => {
    return assertCheckSessionData(req, async (session) => {
        const user = session?.email
        const { data, error } = await supabaseAdmin
            .from('wallet_budget')
            .select('*')
            .eq('created_by', user)
            .eq('status', 1)
            .order('ID', { ascending: false })

        if (error) {
            return NextResponse.json(
                { message: 'Error!', data: error },
                { status: 500 }
            )
        }
        return NextResponse.json(data, { status: 200 })
    })
}
