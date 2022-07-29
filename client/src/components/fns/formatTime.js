import dateTime from "date-and-time";

const timeDiffFromNow = (timeISOString) => {
  const now = new Date();
  const time = new Date(timeISOString);
  const dateFormat = (moment) => dateTime.format(moment, "DD-MM-YYYY");
  const timeFormat = (moment) => dateTime.format(moment, "HH:mm");
  const timeDiff = dateTime.subtract(now, time).toDays();
  const upLoadTimeFormatted = timeFormat(time);
  if (timeDiff > 6) {
    return `${dateFormat(time)}, ${timeFormat(time)}`;
  }

  for (let i = 6; i >= 2; i--) {
    if (timeDiff > 6) {
      break;
    }
    if (timeDiff >= i) {
      return `${i} days ago, ${upLoadTimeFormatted}`;
    }
  }
  if (timeDiff >= 1) {
    return `Yesterday, ${upLoadTimeFormatted}`;
  }
  if (timeDiff >= 0) {
    return `Today, ${upLoadTimeFormatted}`;
  }
};

export { timeDiffFromNow };
