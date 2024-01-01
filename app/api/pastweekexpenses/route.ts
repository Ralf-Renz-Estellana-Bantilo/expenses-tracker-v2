import { NextResponse } from 'next/server';
import { createNewDbConnection } from '../../database/db';

export const POST = async ( req: Request, res: Response ) =>
{
   const db = createNewDbConnection();

   const { user } = await req.json();

   const query = `SELECT * FROM expenses_view exp
      INNER JOIN (
         SELECT 
            DATE(created_on) AS date 
            FROM expenses_view 
               WHERE created_by = '${user}' 
               AND DATE(created_on) != CURRENT_DATE() 
               GROUP BY DATE(created_on) 
               ORDER BY created_on DESC LIMIT 7) days
         ON DATE(exp.created_on) = DATE(days.date) 
      
      WHERE created_by = '${user}';`;
   const result = await db.promise().query( query );

   db.end()
   return NextResponse.json( result[0], { status: 200 } );
}