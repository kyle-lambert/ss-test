export type Response = {
  message: {
    name: string;
    description?: string;
  };
};

export type ErrorResponse = {
  error: {
    name: string;
    description?: string;
    code?: string;
  };
};
