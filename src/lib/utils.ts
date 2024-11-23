import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mockDataOnError<T>(mockData: T): (error: any) => T {
  return (error: any) => {
    console.error('API Error:', error);
    return mockData;
  };
}