import moment from "moment";

//calculate hours in calendar -> creating hours and adding them to array
export const calculateCalendarHours = (startingHour, endingHour) => {
  const allHoursInCalendarGrid = [];
  for (var i = startingHour; i <= endingHour; i++) {
    allHoursInCalendarGrid.push(i);
  }
  return allHoursInCalendarGrid;
};

//create hours that calendar can read
export const createReadebleHours = (hoursArray, whereToStop) => {
  var allHoursAndMinutesInCalendarGrid = [];
  for (var i = 0; i < hoursArray.length; i++) {
    allHoursAndMinutesInCalendarGrid.push({
      value: hoursArray[i],
      label:
        hoursArray[i] > 9 ? hoursArray[i] + ":00" : "0" + hoursArray[i] + ":00",
      tag: "h",
    });
    if (hoursArray[i] === whereToStop) {
      break;
    }
  }

  return allHoursAndMinutesInCalendarGrid;
};

export const increaseDay = (date) => {
  return moment(date, "YYYY-MM-DD").add(1, "days").format("YYYY-MM-DD");
};

export const decreaseDay = (date) => {
  return moment(date, "YYYY-MM-DD").add(-1, "days").format("YYYY-MM-DD");
};

export const increaseWeek = (date) => {};

export const decreaseWeek = (date) => {};

export const fakeData = [
  {
    admin_id: 3,
    admin_name: "ivo",
    company_id: 3,
    date: "2023-10-3",
    description: "ddsfsfdssd",
    end_time: "12:45:00",
    id: 1,
    name: "branimir",
    service_name: ["tvoji zubi", "moji zubi"],
    start_time: "11:00:00",
    status: "Active",
    user_id: null,
    user_name: null,
  },
  {
    admin_id: 4,
    admin_name: "Leonardo",
    company_id: 3,
    date: "2023-10-2",
    description: "gfhfh",
    end_time: "13:45:00",
    id: 2,
    name: "borna",
    service_name: ["njihovi zubi"],
    start_time: "13:00:00",
    status: "Active",
    user_id: null,
    user_name: null,
  },
];

//where to place labels day
export const calculateLabelLengthAndPositionDay = (label) => {
  var HEIGHT_PIXELS = 96;
  var MINUTES = 60;
  var NORMALITED_MINUTE_PIXEL = HEIGHT_PIXELS / MINUTES;

  var label_start_time_array = label.start_time.split(":");
  var label_end_time_array = label.end_time.split(":");

  var label_end_time = label_end_time_array[0] + ":" + label_end_time_array[1];

  //get time difference
  var timeDifference = moment(label_end_time, "HH:mm")
    .subtract({
      hours: label_start_time_array[0],
      minutes: label_start_time_array[1],
    })
    .format("HH:mm")
    .toString();

  //make array of it
  var timeDifferenceArray = timeDifference.split(":");

  //normalize it to calendar
  var normalizedTimeDifference =
    parseInt(timeDifferenceArray[0]) * HEIGHT_PIXELS +
    parseInt(timeDifferenceArray[1]) * NORMALITED_MINUTE_PIXEL;
  //normalize top
  var normalizeMarginTop =
    parseInt(label_start_time_array[0] - 9) * HEIGHT_PIXELS +
    parseInt(label_start_time_array[1]) * NORMALITED_MINUTE_PIXEL;

  return { normalizeMarginTop, normalizedTimeDifference };
};

//where to print days in content header
//print labels on grid
const printLabelOnGirdHandler = (reservationDateDay) => {
  var leftPosition;

  // (percentage)
  var timeColumnWidth = (1 / 12) * 100;

  // sunday
  if (reservationDateDay === 0) {
    leftPosition = timeColumnWidth + (11 / 12 / 7) * 100 * 6;
  }
  // monday
  if (reservationDateDay === 1) {
    leftPosition = timeColumnWidth;
  }
  // Tuesday
  if (reservationDateDay === 2) {
    leftPosition = timeColumnWidth + (11 / 12 / 7) * 100;
  }
  // Wednesday
  if (reservationDateDay === 3) {
    leftPosition = timeColumnWidth + (11 / 12 / 7) * 100 * 2;
  }
  // Thursday
  if (reservationDateDay === 4) {
    leftPosition = timeColumnWidth + (11 / 12 / 7) * 100 * 3;
  }
  // Friday
  if (reservationDateDay === 5) {
    leftPosition = timeColumnWidth + (11 / 12 / 7) * 100 * 4;
  }
  // Saturday
  if (reservationDateDay === 6) {
    leftPosition = timeColumnWidth + (11 / 12 / 7) * 100 * 5;
  }

  return leftPosition;
};

//where to place labels week
export const calculateLabelLengthAndPositionWeek = (label) => {
  // debugger;
  var HEIGHT_PIXELS = 96;
  var MINUTES = 60;
  var NORMALITED_MINUTE_PIXEL = HEIGHT_PIXELS / MINUTES;

  //check day
  var reservationDateDay = moment(label.date, "YYYY-MM-DD").day();

  var label_start_time_array = label.start_time.split(":");
  var label_end_time_array = label.end_time.split(":");

  var label_end_time = label_end_time_array[0] + ":" + label_end_time_array[1];

  var timeDifference = moment(label_end_time, "HH:mm")
    .subtract({
      hours: label_start_time_array[0],
      minutes: label_start_time_array[1],
    })
    .format("HH:mm")
    .toString();

  //make array of it
  var timeDifferenceArray = timeDifference.split(":");

  var normalizedHeight =
    parseInt(timeDifferenceArray[0]) * HEIGHT_PIXELS +
    parseInt(timeDifferenceArray[1]) * NORMALITED_MINUTE_PIXEL;

  var normalizeMarginTop =
    parseInt(label_start_time_array[0] - 9) * HEIGHT_PIXELS +
    parseInt(label_start_time_array[1]) * NORMALITED_MINUTE_PIXEL;

  var normalizeLeftPosition = printLabelOnGirdHandler(reservationDateDay);

  var normalizeWidth = ((11 / 12) * 100) / 7;

  return {
    normalizedHeight,
    normalizeMarginTop,
    normalizeLeftPosition,
    normalizeWidth,
  };
};

// snap to grid
export function snapToGrid(x, y) {
  const snappedX = Math.round(x / 32) * 32;
  const snappedY = Math.round(y / 32) * 32;
  return [snappedX, snappedY];
}
