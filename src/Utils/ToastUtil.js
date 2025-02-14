import { toast } from "react-toastify";

const toastConfig={
          position: "bottom-center",
          className: "toast-message"
}
export function alertSuccess(message){
          toast.success(message, toastConfig);
}

export function alertError(message){
          toast.error(message, toastConfig);
}

export function alertInfo(message){
          toast.info(message, toastConfig);
}