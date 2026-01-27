export type Response<T = any> = {
  status: string;
  message: string;
  data: T;
};
