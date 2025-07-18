import { TransactionsResponse } from "@/types/transaction";


export async function getTransactions(revalidateSeconds = 3600) {
  const res = await fetch(
    'https://uala-dev-challenge.s3.us-east-1.amazonaws.com/transactions.json',
    { next: { revalidate: revalidateSeconds } },
  );
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json() as Promise<TransactionsResponse>;
}