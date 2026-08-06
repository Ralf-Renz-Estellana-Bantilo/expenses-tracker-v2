import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../database/supabase'
import { assertCheckSessionData } from '../helper'
import { isWritableTable } from '../allowlist'

/*
const SAVEDATA_PAYLOAD_SYNTAX = {
   table: 'table_name',
   values: {
      [`column_a`]: `value`,
      [`column_b`]: `value`,
   }
   key?: {
      [`primary_key`]: `ID`,
   }
}
*/
export const POST = async (req: NextRequest) => {
    return assertCheckSessionData(req, async () => {
        try {
            const { table, values, key } = await req.json()

            if (!isWritableTable(table)) {
                return NextResponse.json(
                    { message: `Table '${table}' is not writable` },
                    { status: 400 }
                )
            }

            if (key) {
                let query = supabaseAdmin.from(table).update(values)
                for (const [col, val] of Object.entries(key)) {
                    query = query.eq(col, val as string | number)
                }
                const { data, error } = await query.select()
                if (error) throw error
                return NextResponse.json(data, { status: 200 })
            }

            const { data, error } = await supabaseAdmin
                .from(table)
                .insert(values)
                .select()
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
