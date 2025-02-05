export function handleAxiosError(axiosError){
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
          return amplifyError.message;
}