type Response = {
  name: string;
  description: string;
};
export type ResponseJSON = {
  messages?: Response[];
  errors?: Response[];
};
