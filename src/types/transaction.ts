export type CardType = 'all' | 'visa' | 'mastercard' | 'amex';
export type PaymentMethodType = 'all' | 'link' | 'qr' | 'mpos' | 'pospro';
export type TransactionPeriod = 'daily' | 'weekly' | 'monthly';

export interface Transaction {
  id: string;
  amount: number;
  card: CardType;
  installments: number;
  createdAt: string;  
  updatedAt: string;   
  paymentMethod: PaymentMethodType;
}

export interface MetadataOption {
  value: string;
  label: string;
}

export interface Metadata {
  cards: MetadataOption[];
  paymentMethods: MetadataOption[];
}

export interface TransactionsResponse {
  transactions: Transaction[];
  metadata: Metadata;
}