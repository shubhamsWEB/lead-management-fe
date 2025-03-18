const errorHandler = (error) => error.response ? error.response.data : error;
const successHandler = ({data}) => data;
export { errorHandler, successHandler };
