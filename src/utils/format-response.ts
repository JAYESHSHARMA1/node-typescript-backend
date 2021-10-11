import * as CONSTANTS from "../constants";

const { RESPONSES } = CONSTANTS;

export default (
  message: string,
  data: any,
  isWarning: boolean = false,
  error: any = false,
  statusCode: number = 200
) => {
  console.log(data);
  const code = !!error && error.statusCode ? error.statusCode : statusCode;
  if (!!error && error.statusCode) delete error.statusCode;
  return {
    success: !error ? true : false,
    error: !!error,
    isWarning,
    statusCode: code,
    message:
      message ||
      (error && process.env.NODE_ENV === "production"
        ? RESPONSES.COMMON_500
        : error
        ? error.message || RESPONSES.COMMON_500
        : "Success"),
    data,
  };
};
