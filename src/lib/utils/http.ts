type MessageResponse = {
  title: string;
  description: string;
};
export type JsonResponseFormat = {
  messages: MessageResponse[];
};

type ErrorResponse = {
  title: string;
  description: string;
};
export type JsonErrorResponseFormat = {
  errors: ErrorResponse[];
};
