function convertTimeStampToDate(timeStamp: number): Date {
  return new Date(timeStamp);
}
function convertTimeStampToString(timeStamp: number): string {
  return convertTimeStampToDate(timeStamp).toLocaleString('en-CA', {
    timeZone: 'America/Toronto',
  });
}

function isUndefined(property: any): boolean {
  return property === undefined || property === null;
}


export = {convertTimeStampToDate, convertTimeStampToString, isUndefined }