export const getTime = async () => {
  const time = new Date().getMilliseconds();
  const timeStartEnd = new Date().toLocaleTimeString();
  return { time, timeStartEnd };
};
