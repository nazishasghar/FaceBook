export const getHr = (hour: string): number => {
  let matches = hour.match(/(\d+)/);
  if (matches) {
    return Number(matches[0]);
  }
  return 0;
};
export const converhrTomill = (hour: number): number => {
  return hour * 3600 * 1000;
};
export const calculateExpirationTime = (time: number) => {
  let currentTime = Date.now();

  let expirationTimeSecond = currentTime + time;
  return new Date(expirationTimeSecond);
};

export const calculateRemainingTime = (expirationTime: Date): number => {
  let currentTime = new Date().getTime();
  let expire = new Date(expirationTime);
  let remainingTime = expire.getTime() - currentTime;
  return remainingTime;
};
