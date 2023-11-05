import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import db from '../../database/db';

export const GET = async ( req: NextApiRequest, res: NextApiResponse ) =>
{
   try
   {
      const query = 'SELECT * FROM expenses';
      const result = await db.promise().query( query );
      return NextResponse.json( result[0], { status: 200 } );
   } catch ( err )
   {
      return NextResponse.json( { message: 'Error!', data: err }, { status: 500 } );
   }
}

