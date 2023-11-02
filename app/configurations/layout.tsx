import Header from "../Header"
import NavFooter from "../NavFooter"

export default function ConfigurationsLayout ( {
   children, // will be a page or nested layout
}: {
   children: React.ReactNode
} )
{
   return (
      <section className="flex flex-col h-screen relative">
         <Header title="Configurations" showActions={false} />
         <div className="flex-1 p-3">
            {children}
         </div>
      </section>
   )
}
