import { setDay, setMonth, isAfter, eachWeekOfInterval } from 'date-fns';

export const NOW = new Date();
export const SPRING_SEASON_END = setDay(setMonth(NOW, 6), 1);
export const FALL_SEASON_END = setDay(setMonth(NOW, 11), 24);
export const CURRENT_SEASON_END = isAfter(NOW, SPRING_SEASON_END) ? FALL_SEASON_END : SPRING_SEASON_END;

export const ACCEPTABLE_TIMESLOTS = ['17:45:00', '18:00:00', '17:30:00', '17:15:00'];
export const FORMAT = 'EEEE d. LLLL yyyy';

export const WEDNESDAYS_IN_SEASON = eachWeekOfInterval({
  start: NOW,
  end: CURRENT_SEASON_END,
}, { weekStartsOn: 3 });
