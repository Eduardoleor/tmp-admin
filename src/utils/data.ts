const isValidObj = (obj: any) => {
  return Object.values(obj).every((value) => !!value);
};

export { isValidObj };
