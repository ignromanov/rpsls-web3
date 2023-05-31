// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorMessageHandler = (error: any) => {
  if (error?.data?.message) {
    return error.data.message;
  } else if (error?.message) {
    return error.message;
  } else {
    return error;
  }
};
