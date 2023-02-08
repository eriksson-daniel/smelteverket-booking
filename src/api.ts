import { isWednesday, isBefore } from 'date-fns';
import { NOW, CURRENT_SEASON_END } from './constants';
import { Availability, AvailableDate, Holiday, Holidays } from './types';
import holidays2023 from '../mockdata/holidays2023.json';
import holidays2024 from '../mockdata/holidays2024.json';
import availableDates from '../mockdata/availableDates.json';


const HOLIDAYS_URL = 'https://webapi.no/api/v1/holidays';

export const getHelligdager = async (): Promise<Holiday[]> => {
  // const thisYear = await fetch(`${HOLIDAYS_URL}/${NOW.getFullYear()}`);
  // const nextYear = await fetch(`${HOLIDAYS_URL}/${NOW.getFullYear() + 1}`);

  // const thisYearJson = await thisYear.json() as Holidays;
  // const nextYearJson = await nextYear.json() as Holidays;

  const thisYearJson = holidays2023;
  const nextYearJson = holidays2024;

  return [...thisYearJson.data, ...nextYearJson.data]
    .filter(({ date }) => isWednesday(new Date(date)))
    .filter(({ date }) => isBefore(new Date(date), CURRENT_SEASON_END));
};

const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;

const splitIntervalTo90days = (from: Date, to: Date): [Date, Date][] => {
  const interval = to.valueOf() - from.valueOf();

  if (interval <= NINETY_DAYS) {
    return [[from, to]];
  }

  const intervals: [Date, Date][] = [];
  let start = from;

  while (start.valueOf() < to.valueOf()) {
    const ninetyDaysAhead = new Date(start.valueOf() + NINETY_DAYS);

    const end = isBefore(ninetyDaysAhead, to) ? ninetyDaysAhead : new Date(to);
    intervals.push([start, end]);
    start = end;
  }

  return intervals;

};

export const getAvailableDates = async (): Promise<AvailableDate[]> => {
  // const intervals = splitIntervalTo90days(NOW, CURRENT_SEASON_END);

  // const promises = intervals.map(async ([DateFrom, DateTo]) => {
  //   const body = {
  //     DateFrom: DateFrom.toISOString(),
  //     DateTo: DateTo.toISOString(),
  //     PartySize: 5,
  //     ChannelCode: 'ONLINE',
  //     PromotionId: null,
  //     AreaId: null,
  //     AvailabilityType: 'Reservation',
  //   };

  //   const req = await fetch('https://booking.resdiary.com/api/Restaurant/Smelteverket/AvailabilityForDateRange', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Accept': 'application/json',
  //     },
  //     body: JSON.stringify(body),
  //   });

  //   const response = await req.json() as Availability;
  //   return response.AvailableDates;
  // });

  // const responses = await Promise.all(promises);

  // return responses.flat();
  return Promise.resolve(availableDates.AvailableDates);
};

export const sendBooking = async (VisitDate: string, VisitTime: string) => {
  // const body = {
  //   VisitDate,
  //   VisitTime,
  //   PartySize: 5,
  //   ChannelCode: 'ONLINE',
  //   PromotionId: 143826,
  //   SpecialRequests: '',
  //   Customer: {
  //     FirstName: process.env.FIRST_NAME,
  //     Surname: process.env.LAST_NAME,
  //     Mobile: process.env.MOBILE,
  //     Email: process.env.EMAIL,
  //     ReceiveEmailMarketing: false,
  //     ReceiveSmsMarketing: false,
  //     ReceiveResDiaryEmailMarketing: false,
  //     ReceiveResDiarySmsMarketing: false,
  //     ReceiveRestaurantEmailMarketing: false,
  //     ReceiveRestaurantSmsMarketing: false,
  //     GroupEmailMarketingOptInText: 'I would like to receive news and offers from <strong>Skagstind</strong> by:',
  //     GroupSmsMarketingOptInText: 'I would like to receive news and offers from <strong>Skagstind</strong> by:',
  //     RestaurantEmailMarketingOptInText: 'I would like to receive news and offers from <strong>Smelteverket</strong> by:',
  //     RestaurantSmsMarketingOptInText: 'I would like to receive news and offers from <strong>Smelteverket</strong> by:',
  //     PhoneCountryCode: '47',
  //     MobileCountryCode: '47',
  //   },
  //   IsLeaveTimeConfirmed: false,
  //   PaymentMethodId: null,
  //   PaymentIntentId: null,
  //   Households: null,
  // };

  // const res = await fetch('https://booking.resdiary.com/api/Restaurant/Smelteverket/BookingWithStripeToken', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json',
  //   },
  //   body: JSON.stringify(body),
  // });

  // if (!res.ok) {
  //   const errorMessage = `Booking failed: ${res.statusText} (${res.status})`;
  //   throw new Error(errorMessage);
  // }

  // return res.json();
  return Promise.resolve();
}; 