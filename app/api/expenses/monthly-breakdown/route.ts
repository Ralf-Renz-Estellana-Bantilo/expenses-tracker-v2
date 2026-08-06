import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/database/supabase'
import { assertCheckSessionData } from '../../helper'

export const GET = async (req: NextRequest) => {
    return assertCheckSessionData(req, async (session) => {
        const user = session?.email
        const { data, error } = await supabaseAdmin
            .from('monthly_expenses_view')
            .select('*')
            .eq('user', user)
            .order('monthID', { ascending: true })

        if (error) {
            return NextResponse.json(
                { message: 'Error!', data: error },
                { status: 500 }
            )
        }
        return NextResponse.json(data, { status: 200 })
    })
}
