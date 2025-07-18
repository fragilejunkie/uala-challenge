import { Transaction } from "@/types/transaction";
import { Metadata } from '@/types/transaction';


export interface TransactionRowProps {
    transaction: Transaction
    metadata: Metadata  
}