import dateTime from "date-and-time";

const timeDiffFromNow = (timeISOString) => {
  const now = new Date();
  const time = new Date(timeISOString);
  const dateFormat = (moment) => dateTime.format(moment, "DD-MM-YYYY");
  const timeFormat = (moment) => dateTime.format(moment, "HH:mm");
  const timeDiff = dateTime.subtract(now, time).toDays();
  const upLoadTimeFormatted = timeFormat(time);
  // console.log(dateTime.format(time, "DD-MM-YYYY"))

  //today
  if (dateTime.isSameDay(now, time)) {
    return `Today, ${upLoadTimeFormatted}`;
  } else {
    //more than 6 days
    if (timeDiff > 6) {
      return `${dateFormat(time)}, ${timeFormat(time)}`;
    }

    //2-6 days ago
    for (let i = 6; i >= 2; i--) {
      if (timeDiff >= i) {
        return `${i} days ago, ${upLoadTimeFormatted}`;
      }
    }

    //Yesterday

    return `Yesterday, ${upLoadTimeFormatted}`;
  }
};

export { timeDiffFromNow };
