import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../database/supabase'
import { assertCheckSessionData } from '../helper'

export const POST = async (req: NextRequest) => {
    return assertCheckSessionData(req, async (session) => {
        try {
            const { searchText } = await req.json()
            const user = session?.email
            const escaped = String(searchText ?? '').replace(/[%,]/g, '')
            const pattern = `%${escaped}%`

            const { data, error } = await supabaseAdmin
                .from('expenses_view')
                .select('*')
                .eq('status', 1)
                .eq('created_by', user)
                .or(`description.ilike.${pattern},category.ilike.${pattern}`)
            if (error) throw error
            return NextResponse.json(data, { status: 200 })
        } catch (err) {
            return NextResponse.json(
                { message: 'Error!', data: err },
                { status: 500 }
            )
        }
    })
}
