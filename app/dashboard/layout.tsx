import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Header from "../Header"
import NavFooter from "../NavFooter"

export default async function DashboardLayout ( {
   children, // will be a page or nested layout
}: {

   children: React.ReactNode
} )
{
   const session = await getServerSession();
   if ( !session || !session.user )
   {
      redirect( "/login" );
   }

   return (
      <section className="flex flex-col h-screen relative">
         <Header />
         <div className="flex-1 p-3">
            {children}
         </div>
         <NavFooter />
      </section>
   )
}
