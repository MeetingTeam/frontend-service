import { useSnackbar } from 'notistack';

export const useSnackbarUtil = () => {
  const { enqueueSnackbar } = useSnackbar();
  const anchorOrigin = { horizontal: 'center' , vertical: 'bottom'}

  const showSuccessMessage = (message) => {
          const config = {variant: 'success',anchorOrigin: anchorOrigin}
          enqueueSnackbar(message, config);
  };

  const showErrorMessage = (message) => {
          const config = {variant: 'error' ,anchorOrigin: anchorOrigin}
          enqueueSnackbar(message, config);
  };

  return {
    showSuccessMessage,
    showErrorMessage
  };
};