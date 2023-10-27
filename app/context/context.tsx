import React, { createContext, useState, ReactNode, useEffect, useContext } from "react";
import { DashboardIcon, ProfileIcon, SettingsIcon } from "../icons/icons";
import { ContextType, TabType } from "../types/type";
import { usePathname } from "next/navigation";
import { PREVIOUS_EXPENSES_VIEW, TODAYS_EXPENSES_VIEW } from "../database/database";
import { useSession } from 'next-auth/react'

export const ComponentContext = createContext<ContextType | null>( null )

export default function ComponentContextProvider ( { children }: { children: ReactNode } )
{

   const { data: session } = useSession();
   const pathname = usePathname()
   const [tabs] = useState<TabType[]>( [
      {
         ID: 1,
         description: 'Dashboard',
         path: '/dashboard',
         icon: <DashboardIcon />,
      },
      {
         ID: 2,
         description: 'Profile',
         path: '/profile',
         icon: <ProfileIcon />,
      },
      {
         ID: 3,
         description: 'Settings',
         path: '/settings',
         icon: <SettingsIcon />,
      },
   ] )
   const defaultTabInfo: TabType = { ...tabs[0], description: 'Expenses Tracker' }

   const [activeTab, setActiveTab] = useState<TabType>( defaultTabInfo )
   const [todayExpenses, setTodayExpenses] = useState( () => TODAYS_EXPENSES_VIEW( session?.user?.email || undefined ) )
   const [previousExpenses] = useState( () => PREVIOUS_EXPENSES_VIEW( session?.user?.email || undefined ) )

   useEffect( () =>
   {
      if ( tabs.map( ( { path } ) => path ).includes( pathname ) )
      {
         const activeRoute = tabs.find( tab => tab.path === pathname )
         setActiveTab( activeRoute || defaultTabInfo )
      }
   }, [] )

   const handleUpdateExpense = ( newExpense: typeof todayExpenses[0], type: 'add' | 'edit' ) =>
   {
      let updatedExpenses = null
      if ( type === 'add' )
      {
         updatedExpenses = [newExpense, ...todayExpenses] as typeof todayExpenses
      } else
      {
         updatedExpenses = todayExpenses.map( expense =>
            expense.ID === newExpense.ID
               ? {
                  ...expense,
                  amount: newExpense.amount,
                  description: newExpense.description,
                  categoryID: newExpense.categoryID,
                  category: newExpense.category,
               }
               : expense
         )
      }
      console.log( updatedExpenses, newExpense, type )
      setTodayExpenses( updatedExpenses )
   }

   const value: ContextType = {
      tabs,
      activeTab,
      todayExpenses,
      previousExpenses,
      setActiveTab,
      handleUpdateExpense,
   }

   return (
      <ComponentContext.Provider value={value}>
         {children}
      </ComponentContext.Provider>
   )
}

export const AppContext = () =>
{
   return useContext( ComponentContext )
}