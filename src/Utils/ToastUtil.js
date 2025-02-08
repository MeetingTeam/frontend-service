import { toast } from "react-toastify";

export function alertSuccess(message){
          toast.success(message, {
                    position: "top-right"
          });
}

export function alertError(message){
          toast.error(message, {
                    position: "top-right"
          });
}

export function alertInfo(message){
          toast.info(message, {
                    position: "top-right"
          });
}