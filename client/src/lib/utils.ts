import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string, currency: string = 'INR'): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency
  }).format(numAmount);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM dd, yyyy');
  } catch (error) {
    return '';
  }
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMM dd, yyyy h:mm a');
  } catch (error) {
    return '';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function generateOrderNumber(): string {
  const prefix = "ORD";
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${random}`;
}

export function calculateTotal(price: number, quantity: number): number {
  return parseFloat((price * quantity).toFixed(2));
}

export function getInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function getStatusColor(status: string): {
  bgColor: string;
  textColor: string;
} {
  switch (status.toLowerCase()) {
    case 'delivered':
    case 'completed':
    case 'active':
    case 'approved':
      return { bgColor: 'bg-green-100', textColor: 'text-green-800' };
    case 'pending':
    case 'processing':
    case 'in_progress':
      return { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
    case 'shipped':
      return { bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
    case 'canceled':
    case 'rejected':
    case 'failed':
      return { bgColor: 'bg-red-100', textColor: 'text-red-800' };
    case 'on_hold':
    case 'backordered':
      return { bgColor: 'bg-orange-100', textColor: 'text-orange-800' };
    default:
      return { bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
  }
}

export function getRandomColor(index: number): string {
  const colors = [
    'bg-primary text-white',
    'bg-secondary text-white',
    'bg-accent text-white',
    'bg-green-500 text-white',
    'bg-yellow-500 text-white',
    'bg-purple-500 text-white',
    'bg-indigo-500 text-white',
  ];

  return colors[index % colors.length];
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export function parseQueryParams(queryString: string) {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};

  for (const [key, value] of params.entries()) {
    result[key] = value;
  }

  return result;
}