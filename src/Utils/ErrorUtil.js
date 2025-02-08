export function handleAxiosError(axiosError){
          if(!axiosError.response||!axiosError.response.data)
                    return "Unknown error";
          const errorDto= axiosError.response.data;
          let errorMessage="";
          if(errorDto.fieldErrors) {
                    for(let key in errorDto.fieldErrors){
                              errorMessage +=`${key}: ${errorDto.fieldErrors[key]}\n`;
                    }
          }
          else errorMessage=errorDto.detail;
          return errorMessage;
}

export function handleAmplifyError(amplifyError){
          if(!amplifyError.message) return "Unknown error";
          return amplifyError.message;
}