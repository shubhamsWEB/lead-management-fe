import { apiServer } from './apiServer/index';
import { errorHandler, successHandler } from './responseHandler';

const serverMap = { apiServer};

class HandleRequest {
  server = null;

  config = {};

  static headers = {
  };

  static Logger = null;

  constructor(server, config) {
    this.server = serverMap[server];
    this.config = { headers: HandleRequest.headers, ...config };
  }

  call = (config = this.config, successFn = successHandler, failureFn = errorHandler) =>
    this.server({ headers: HandleRequest.headers, ...config })
      .then((response) => {

        return Promise.resolve(successFn(response))
      })
      .catch((error) => {
        return Promise.reject(failureFn(error))
      });

  static setHeader = (headers = {}) => {

    // temporary hardcoded
    HandleRequest.headers = {
      ...headers,
    };

    HandleRequest.Logger = headers?.loggerId;
  };

  static setMinHeader;

  static getHeader = () => HandleRequest.headers;

  static getLogger = () => HandleRequest.Logger;
}
export default HandleRequest;
