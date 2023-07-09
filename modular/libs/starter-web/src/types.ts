export type BaseHttpResponse = {
  status: number;
  statusText: string;
};

export type SuccessfulResponse = {
  data: any
} & BaseHttpResponse;

export type FailedResponse = {
  errors: any[];
} & BaseHttpResponse;

export type HttpErrorResult = {
  status: number;
  errors: any[];
}