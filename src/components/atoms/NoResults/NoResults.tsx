import Image from 'next/image'
import styles from './NoResults.module.scss'

export default function NoResults() {
  return (
    <li className={styles.noResults}>
      <Image
        src="./small-empty-busqueda.svg"
        alt="Imágen de búsqueda vacía"
        width="72"
        height="72"
      />
      <span className={styles.noResultsText}>
        No hay resultados que mostrar. <br />
        Podés probar usando los filtros.
      </span>
    </li>
  )
}
