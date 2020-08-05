export const getErrorMessage = (error) => {
    if (error.response && error.response.data && error.response.data.error.message) return error.response.data.error.message;
    if (error.toJSON().message) return error.toJSON().message;
    return 'Error occured.';
}