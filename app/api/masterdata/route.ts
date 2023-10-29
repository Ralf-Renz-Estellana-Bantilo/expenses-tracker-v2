import { NextResponse } from 'next/server';
import db from '../../database/db';
import { MasterSelectPayloadType } from '@/app/types/type';

/* 
const MASTERDATA_PAYLOAD_SYNTAX = {
   tables: ['table_name_a', 'table_name_b', 'table_name_c']
} 
*/

export const POST = async ( req: Request, res: Response ) =>
{
   const { tables } = await req.json();
   let responseArray: any = [];
   await new Promise( function ( resolve, reject )
   {
      let isRejected: boolean = false;

      for ( let a = 0; a < tables.length; a++ )
      {

         const table = tables[a];
         db.query( `SELECT * FROM ${table}`, function ( err, rows, fields )
         {

            if ( isRejected )
            {
               return NextResponse.json( { message: 'Error on line 33!', data: err } );
            }

            if ( !err )
            {
               responseArray = { ...responseArray, [table]: rows };
            } else
            {
               isRejected = true;
               reject( err );
               return NextResponse.json( { message: 'Error!', data: err } );
            }

            if ( a == tables.length - 1 )
            {
               resolve( responseArray );
               console.log( responseArray )
            }
         } );
      }
   } );

   return NextResponse.json( responseArray )
}