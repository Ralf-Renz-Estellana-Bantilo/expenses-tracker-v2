import React from 'react'
import { AlertType } from '../types/type';
import { toast } from 'react-toastify'

const useAlert = ( { type, message, autoClose, position, theme }: AlertType ) =>
{
   const defaultToastProp = {
      position: position ?? "bottom-right",
      autoClose: autoClose ?? 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ?? "dark",
   }

   let showAlert = null
   toast.success( 'New expense has been added!', {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
   } );

   return showAlert
}

export default useAlert