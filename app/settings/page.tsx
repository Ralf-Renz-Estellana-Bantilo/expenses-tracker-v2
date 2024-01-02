import { redirect } from "next/navigation"
import CategoryMaintenance from "./CategoryMaintenance"
import WalletMaintenance from "./WalletMaintenance"
import { getServerSession } from "next-auth"

const SettingsPage = async () => {
  const session = await getServerSession()
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col gap-3">
      <WalletMaintenance />

      <CategoryMaintenance />
    </div>
  )
}

export default SettingsPage
