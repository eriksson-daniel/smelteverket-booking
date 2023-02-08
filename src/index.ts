import * as dotenv from 'dotenv';
import { format, isSameDay, isWednesday, setDefaultOptions } from 'date-fns';
import { nb } from 'date-fns/locale';
import { getAvailableDates, getHelligdager, sendBooking } from './api';
import { ACCEPTABLE_TIMESLOTS, FORMAT, WEDNESDAYS_IN_SEASON } from './constants';

dotenv.config();

setDefaultOptions({ locale: nb });

const run = async () => {
  console.info('Velkommen til Daniels Smelteverk-booking!\n');

  const helligdager = await getHelligdager();

  const wantedWednesdays = WEDNESDAYS_IN_SEASON
    .filter(date => !helligdager.some(({ date: holidayDate }) => isSameDay(new Date(holidayDate), date)));

  const availableDates = await getAvailableDates();

  const availableWednesdays = availableDates
    .filter(({ Date: date }) => isWednesday(new Date(date)))
    .filter(({ Date: date }) => !helligdager.some(({ date: holidayDate }) => isSameDay(new Date(date), new Date(holidayDate))))
    .filter(({ AvailableTimes }) => AvailableTimes.some(({ TimeSlot }) => ACCEPTABLE_TIMESLOTS.includes(TimeSlot)))
    .map(({ Date: date, AvailableTimes }) => {
      const times = AvailableTimes.map(({ TimeSlot }) => TimeSlot);
      const time = ACCEPTABLE_TIMESLOTS.find(t => times.includes(t));

      if (time === undefined) throw new Error('No acceptable timeslot found');

      return ({ date, time });
    });

  const formattedWednesdays = availableWednesdays
    .map(({ date, time }) => {
      const bestTime = ACCEPTABLE_TIMESLOTS.find(t => t === time);
      return format(new Date(date), FORMAT) + ' ' + bestTime;
    });

  console.info('Forsøker å booke følgende tidspunkter:');
  console.info(formattedWednesdays, '\n');

  helligdager.forEach(({ date, description }) => {
    console.info('Kommer ikke til å forsøke å booke:', format(new Date(date), FORMAT), `(${description})`, '\n');
  });

  const promises = availableWednesdays.map(({ date, time }) => sendBooking(date, time)
    .then(() => console.info(format(new Date(date), FORMAT), time, 'er booket!')));

  await Promise.all(promises);

  const missingWednesdays = wantedWednesdays
    .filter(wednesday => !availableWednesdays.some(({ date }) => isSameDay(new Date(date), wednesday)))
    .map(date => format(date, FORMAT));

  console.info('\nDisse datoene mangler en god bookingmulighet og er følgelig ikke booket:');
  console.info(missingWednesdays);
};

run();
