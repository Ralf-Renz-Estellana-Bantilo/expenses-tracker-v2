import CategoryMaintenance from './CategoryMaintenance'
import GeneralSettings from './GeneralSettings'
import LogoutButton from './LogoutButton'
import WalletMaintenance from './WalletMaintenance'

const SettingsPage = async () => {
    return (
        <div className="flex flex-col gap-3">
            <WalletMaintenance />
            <CategoryMaintenance />
            <GeneralSettings />
            <LogoutButton />
        </div>
    )
}

export default SettingsPage
