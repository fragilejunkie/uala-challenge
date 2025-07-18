import { Transaction, CardType, PaymentMethodType, TransactionPeriod } from '@/types/transaction';
import { DateRange } from 'react-day-picker';

export interface TransactionFilters {
  period: TransactionPeriod;
  selectedCards: CardType[];
  selectedMethods: PaymentMethodType[];
  selectedInstallments: number[];
  selectedDates: DateRange | undefined;   
  amountRange: [number, number];
}

export function sumTransactions(transactions: Transaction[]): number {
  return transactions.reduce(
    (runningTotal, transaction) => runningTotal + transaction.amount,
    0,
  );
}

export function uniqueInstallments(transactions: Transaction[]): number[] {
  return [
    ...new Set(transactions.map((transactions) => transactions.installments)),
  ]}

export function formatCurrency(
  value: number,
  locale: string = 'es-AR',
  currency: string = 'ARS',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function splitCurrencyParts(
  formattedCurrency: string,
): [string, string] {
  // Remove any non-breaking space that Intl places after the symbol
  const cleaned = formattedCurrency.replace(/\s/g, '');
  const [integerPart, decimalPart = '00'] = cleaned.split(',');
  return [integerPart, decimalPart];
}

function getPeriodStart(period: TransactionPeriod, now: Date = new Date()): Date {
  const start = new Date(now); // copy
  start.setHours(0, 0, 0, 0);  // zero the clock

  if (period === 'daily') return start;

  if (period === 'weekly') {
    const dayOfWeek = start.getDay();          // 0 = Sunday
    start.setDate(start.getDate() - dayOfWeek);
    return start;
  }

  // monthly
  start.setDate(1);
  return start;
}

export function filterTransactions(
  transactions: Transaction[],
  filters: TransactionFilters, 
  nowOverride?: Date,
): Transaction[] {
  const { period, selectedCards, selectedMethods, selectedInstallments, selectedDates, amountRange } = filters;

  const now = nowOverride ?? new Date();
  const periodStart = getPeriodStart(period, now);
  const [minAmount, maxAmount] = amountRange;

  return transactions.filter((transaction) => {
    const updatedAt = new Date(transaction.updatedAt);

    if (selectedDates) {
      const { from, to } = selectedDates;

      // Require both ends; otherwise treat as no range filter
      if (from && to) {
        const rangeStart = new Date(from);
        rangeStart.setHours(0, 0, 0, 0);              // start‑of‑day

        const rangeEnd = new Date(to);
        rangeEnd.setHours(23, 59, 59, 999);           // end‑of‑day

        if (updatedAt < rangeStart || updatedAt > rangeEnd) return false;
      }
    } else {
      if (updatedAt < periodStart || updatedAt > now) return false;
    }

    if (
      selectedCards.length &&                 
      !selectedCards.includes(transaction.card)
    ) {
      return false;
    }


    if (
      selectedMethods.length &&
      !selectedMethods.includes(transaction.paymentMethod)
    ) {
      return false;
    }


    if (
      selectedInstallments.length &&
      !selectedInstallments.includes(transaction.installments)
    ) {
      return false
    } 

    if (transaction.amount < minAmount || transaction.amount > maxAmount)
      return false;

    return true; 
  });
}