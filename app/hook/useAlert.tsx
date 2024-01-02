import { AlertType } from "../types/type"
import { ToastOptions, toast } from "react-toastify"

const useAlert = () => {
  let config: ToastOptions<{}> = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  }

  const showAlert = ({
    type,
    message,
    timeout,
    position,
    theme,
  }: AlertType) => {
    config.position = position ?? config.position
    config.autoClose = timeout ?? config.autoClose
    config.theme = theme ?? config.theme

    if (type === "success") {
      toast.success(message, config)
    } else if (type === "error") {
      toast.error(message, config)
    } else if (type === "info") {
      toast.info(message, config)
    } else if (type === "warning") {
      toast.warning(message, config)
    }
  }

  return { showAlert }
}

export default useAlert
