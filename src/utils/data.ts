const isValidObj = (obj: any) => {
  return Object.values(obj).every((value) => !!value);
};

const calculatePagesCount = (pageSize: number, totalCount: number) => {
  return totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize);
};
export { calculatePagesCount, isValidObj };
