import { snackbarActions as snackbar } from './index';

export default {
  async runAsyncWithNotification(
    dispatch,
    successMessage,
    errorMessageCb,
    asyncFn,
  ) {
    try {
      const result = await asyncFn();

      dispatch(snackbar.show({ message: successMessage }));

      return result;
    } catch (error) {
      console.error(error, error.stack);

      dispatch(snackbar.show({ message: errorMessageCb(error) }));

      throw error;
    }
  },
};
