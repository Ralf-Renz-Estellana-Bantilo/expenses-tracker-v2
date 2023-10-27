import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function Home ()
{
  const session = await getServerSession();
  if ( !session || !session.user )
  {
    redirect( "/login" );
  } else
  {
    redirect( "/dashboard" );
  }
}