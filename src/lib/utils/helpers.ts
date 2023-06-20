export const getInitial = (name: string) => {
  return name.split(" ").slice(0, 1).join("")[0].toUpperCase();
};
