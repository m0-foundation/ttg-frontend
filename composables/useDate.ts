import _dayjs, { UnitType } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";

const dayjs = _dayjs;
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export const useDate = (timestampSeconds: number) => {
  const date = dayjs.unix(timestampSeconds);
  const now = dayjs();

  const timeAgo = dayjs(now).to(dayjs(date));

  const toFormat = (dateFormat: string) => {
    return date.format(dateFormat);
  };

  const getDate = (unit: UnitType) => {
    return date.get(unit);
  };

  const toUtc = (format: string) => {
    return date.utc().format(format);
  };

  const toTimezone = (local: string, format: string) => {
    return date.tz(local).format(format);
  };

  const difference = (dateSec: Date, unit: UnitType) => {
    return date.diff(dayjs(dateSec), unit);
  };

  return {
    difference,
    getDate,
    timeAgo,
    toFormat,
    toTimezone,
    toUtc,
  };
};

/*
  getDate("date"),
  utc("LLLL"),
  timezone("America/New_York", "L LT"),
  difference("2018-06-05", "day"),
*/
