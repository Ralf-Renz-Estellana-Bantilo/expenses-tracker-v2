import { NextRequest, NextResponse } from 'next/server'
import { assertCheckSessionData } from '../helper'
import { supabaseAdmin } from '@/app/database/supabase'

export const POST = async (req: NextRequest) => {
    return assertCheckSessionData(req, async (session) => {
        const user = session?.email
        try {
            const { data, error } = await supabaseAdmin
                .from('users')
                .select('*')
                .eq('email', user)
            if (error) throw error
            return NextResponse.json(data, { status: 200 })
        } catch (err) {
            return NextResponse.json(
                { message: 'Unauthorized user!', data: err },
                { status: 500 }
            )
        }
    })
}
