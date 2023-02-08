export interface Holiday {
  date: string;
  description: string;
}

export interface Holidays {
  data: Holiday[];
}

interface AvailableTime {
  TimeSlot: string;
}

export interface AvailableDate {
  Date: string;
  AvailableTimes: AvailableTime[];
}

export interface Availability {
  AvailableDates: AvailableDate[];
}
