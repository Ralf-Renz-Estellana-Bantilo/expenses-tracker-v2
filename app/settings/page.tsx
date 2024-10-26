import CategoryMaintenance from "./CategoryMaintenance"
import LogoutButton from "./LogoutButton"
import WalletMaintenance from "./WalletMaintenance"

const SettingsPage = async () => {
  return (
    <div className="flex flex-col gap-3">
      <WalletMaintenance />
      <CategoryMaintenance />
      <LogoutButton />
    </div>
  )
}

export default SettingsPage
