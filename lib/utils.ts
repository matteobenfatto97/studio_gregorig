import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

// FORMAT DATE TIME
export const formatDateTime = (
  dateString: Date | string,
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
) => {
  // Options for formatting both date and time
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24-hour clock
    timeZone: "UTC", // Adjust according to the required time zone
  };

  // Options for formatting date with full weekday
  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "long", // Full weekday name (e.g., 'Monday')
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  };

  // Options for formatting only the date (dd/mm/yyyy)
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  };

  // Options for formatting only the time
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit", // Include seconds if needed
    hour12: false, // 24-hour clock
    timeZone: "UTC",
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-GB",
    dateTimeOptions
  );

  const formattedDateDay: string = new Date(dateString).toLocaleString(
    "en-GB",
    dateDayOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-GB",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-GB",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function encryptKey(passkey: string) {
  return btoa(passkey);
}

export function decryptKey(passkey: string) {
  return atob(passkey);
}
