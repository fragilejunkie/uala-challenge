import styles from './page.module.scss'
import { getTransactions } from '@/lib/getTransactions'
import TransactionList from '@/components/organism/TransactionList/TransactionList'
import MetricsContainer from '@/components/organism/MetricsContainer/MetricsContainer'
import Header from '@/components/molecule/Header/Header'
import { TransactionFilterProvider } from '@/lib/context/TransactionsFilterContext'

export default async function Home() {
  const { transactions, metadata } = await getTransactions()

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <TransactionFilterProvider transactions={transactions}>
          <MetricsContainer />
          <TransactionList metadata={metadata} />
        </TransactionFilterProvider>
      </main>
    </div>
  )
}
