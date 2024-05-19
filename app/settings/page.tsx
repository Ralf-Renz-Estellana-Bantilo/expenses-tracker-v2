import CategoryMaintenance from "./CategoryMaintenance"
import WalletMaintenance from "./WalletMaintenance"

const SettingsPage = async () => {
  return (
    <div className="flex flex-col gap-3">
      <WalletMaintenance />

      <CategoryMaintenance />
    </div>
  )
}

export default SettingsPage
