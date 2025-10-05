import React from 'react'
import ProfileImage from './components/ProfileImage'
import ProfileSections from './components/ProfileSections'
import MonthlyExpensesList from './components/MonthlyExpensesList'

const ProfilePage = () => {
    return (
        <div className="flex flex-col gap-3">
            <ProfileImage />
            <ProfileSections />
            <MonthlyExpensesList />
        </div>
    )
}

export default ProfilePage
