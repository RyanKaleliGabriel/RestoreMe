export const getTime = async() => {
  const time = new Date().toLocaleTimeString();
  return time;
};
