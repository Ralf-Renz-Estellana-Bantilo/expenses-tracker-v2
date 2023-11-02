import Header from "../Header"
import NavFooter from "../NavFooter"

export default function SettingsLayout ( {
   children, // will be a page or nested layout
}: {
   children: React.ReactNode
} )
{
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
