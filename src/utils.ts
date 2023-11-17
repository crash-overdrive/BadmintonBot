export function convertTimeStampToDate(timeStamp: number): Date {
  return new Date(timeStamp);
}
export function convertTimeStampToString(timeStamp: number): string {
  return convertTimeStampToDate(timeStamp).toLocaleString('en-CA', {
    timeZone: 'America/Toronto',
  });
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function isUndefined(property: any): boolean {
  return property === undefined || property === null;
}
