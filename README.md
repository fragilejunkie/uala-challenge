
# Web Developer Challenge - Ualá

En este challenge, se debe desarrollar una aplicación web de cobros online que permita a los usuarios visualizar, filtrar y exportar sus transacciones utilizando React/Next.

## Requerimientos y criterios de evaluación

### Requerimientos

La aplicación deberá permitir que el usuario:

- [x]  Visualice el historial de transacciones
- [x]  Visualice el total de cobros con posibilidad de ver cobros del día, semana o mes actual
- [x]  Pueda filtrar las operaciones por fecha, monto, tarjeta, cuotas y métodos de cobro
- [x]  La fecha va estar siempre dentro del año 2025
- [x]  El rango del monto puede ir desde $0 hasta $2000
- [x]  La lista de posibles tarjetas, cuotas y métodos de cobro se encuentra en la respuesta de la API provista
- [x]  Se pueden usar dos o más filtros en simultáneo
- [ ]  Opcional: Pueda exportar transacciones mediante un rango de fechas

### Criterios de evaluación

- Fidelidad al diseño proporcionado en Figma
- Calidad del código: claridad, estructura, modularidad, reutilización y mantenibilidad
- Manejo de estado: uso adecuado de hooks y patrones de gestión de estado
- Experiencia de usuario: navegación intuitiva sin fricciones y diseño responsivo para distintos tamaños de pantalla mobile.
- Implementación de tests unitarios de calidad utilizando Jest o Vitest con React Testing Library
- Manejo de TypeScript para la definición adecuada de tipos e interfaces
- Implementación adecuada de ESLint y Prettier para mantener código limpio
- Correcta implementación con Nextjs o Vite

## Instrucciones de instalación y ejecución

Clonar el proyecto:

```bash
  git clone https://github.com/fragilejunkie/uala-challenge.git
```

Instalar dependencias:

```bash
  npm install
```

Arrancar el server:

```bash
  npm run dev
```

O buildear:

```bash
  npm run build
```

Arrancar la versión estática:

```bash
  npm run start
```

Testear:

```bash
  npm run test
```

## Documentación

- [NextJS](https://nextjs.org/docs)
- [React](https://react.dev/)
- [SASS](https://sass-lang.com/documentation/)
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [RadixUI | Slider](https://www.radix-ui.com/primitives/docs/components/slider)
- [React Day Picker](https://daypicker.dev/)
- [Jest](https://jestjs.io/)

## Links

[Repo en Github](https://github.com/fragilejunkie/uala-challenge)
[Aplicación desplegada en Vercel](https://uala-challenge-henna.vercel.app/)

## Arquitectura y decisiones técnicas

### Comienzo del challenge y estructura base

Para este challenge, decidí comenzar creando los distintos tipos de componentes de UI presentes en el archivo de diseño que se entrega linkeado en el PDF, sin integrar el contexto y el fetch a la API, empecé por utilizar la Page.tsx / Layout.tsx base como punto de partida ya que es solo una página para todo su contenido (en el caso de haber sido más páginas, tal vez hubiera utilizado Pages Router para una separación de contextos más clara), usando como base para el estilado SASS a través de CSS Modules; en lo personal, prefiero una buena separación de contextos entre el estilo y el resto del código, y en lo posible, el mayor control sobre el mismo desde sus stylesheets particulares. Para mantener un buen standard en el código y su presentación, como se pide en el challenge, pero también como un standard propio, los archivos pasan por eslint y prettier al guardarlos, también se respeta el uso de 'use client' para solo los archivos que requieran uso de estados o interacción del usuario, todo el resto de los componentes que el usuario no ve o no necesita ver, están del lado del server.

Primero armé la estructura de organismos desde lo más general, MetricsContainer y TransactionList, ya que son los dos grandes contenedores con los que el usuario interactúa con la información que se presenta en primera instancia. Al mismo tiempo, fui populando global.css con un reset básico en los elementos de markup y generé la mayoría de las variables de estilo que están presentes en Figma con respecto a los componentes que se encuentran allí. En el caso de las variables de estilo, al no tener acceso a documentación más detallada y la librería de la cual parten, algunos nombres y convenciones fueron cambiadas, pero en el caso de que existan documentos de diseño que sirvan como SSOT cross-area usaría 1:1 los mismos que existan allí. Cada componente en particular, tiene su propio .module.scss y en el caso de ser necesario, .types.ts; en algunas instancias los tipos/interfaces están en el mismo archivo por una cuestión de practicidad ya que algunos se repiten o se referencian desde otros y en algún punto fue un poco redundante o demasiado separado de su contexto el separarlos para una mejor lectura.

### Creación de componentes a través de su jerarquía

Una vez que ambos organismos estuvieron populados y estilados en su general, comencé a abstraer los átomos reutilizados y las moléculas que me permitieran repetir componentes en vez de código a través de la app. De nuevo, al no tener documentación de diseño completa, preferí esperar hasta esta instancia para poder generar estos componentes para poder apreciar de mejor manera que y donde se repite, para la construcción de sus estados, props, variables, data y uso. Los átomos de UI son agnósticos de su estado, el cual se mantiene en un mejor contexto en el componente en el cual se los llama y es el criterio base que los separa de otras moléculas u organismos (aparte de su construcción, ya que idealmente son el elemento más básico posible en la jerarquía de uso; esto se rompe por ejemplo en los botones que utilizan íconos, pero se comprende a través de su uso).

### Fetch de la API y filtros base

Al terminar con esta estructura base, el siguiente paso fue generar los tipos e interfaces necesarios a través de la información presente en el json que popula la información que el usuario tiene disponible en la lista de operaciones, armar el fetch (getTransactions) y utilizar su data en el contexto que consume la app de forma global (TransactionFilterContext) y sus utilidades (transactionUtils).

La idea principal acá es hacer un solo fetch al json (Page.tsx), y después manejar y filtrar esa data a través de useMemos, ya que consideré que aparte de las cuestiones básicas de evitar recalculos y optimizar la velocidad de rendereo, necesitaba una distinción entre el total de las transacciones y sus filtrados entre ambos organismos. Esto puede ser una mala abstracción de su uso devenida del archivo de diseño, ya que al no tener comentarios y pocas pantallas de uso real, no me quedó muy claro la relación entre ambas; en tal caso asumí que en primera instancia, existe una diferenciación de contextos entre la parte superior (MetricsContainer) y la parte inferior (TransactionList), en donde en una se refiere a un periodo de tiempo diario, semanal (desde el comienzo de la semana) o mensual (desde el comienzo del mes) y el otro se refiere a un historial general de operaciones las cuales se pueden filtrar a través de el overlay de filtros más adelante.

El json presente en el API disponible ocupa todo el año, para que la experiencia de uso sea un poco más coherente se dejan afuera todas las operaciones que ocurran a futuro. Como dije previamente, se toma en los periodos las operaciones a nivel diario, semanal y mensual, con respecto al dia, semana y mes actual, esto sucede en las utils. En este archivo de utils también suceden algunos cálculos y cleanups que van se van a dar solo una vez, para un mejor uso en el contexto y en los componentes que van a popular.

Una vez que terminé con la estructura base del contexto, vi que el fetch estaba trayendo la data necesaria, la misma estaba con un formato correcto (fechas legibles por seres humanos, mapeo de metodos de pago y tarjetas utilizando la metadata disponible, algún que otro QoL) y la separación de contextos estaba funcionando bien, pasé a la construcción de los filtros de la lista de operaciones.

### Panel de filtros

El siguiente paso fue desarrollar el elemento más complejo de la app, TransactionListFilterPane, o el overlay que contiene los distintos filtros disponibles.
Para esto comencé con su estructura base y su management de estado para ver si aparecía o no, en primera instancia mantuve un condicional con su useState pero esto traía algunos issues a nivel presentación, por lo cual decidí mantenerlo escondido y hacerlo aparecer a través de estilos y una transición; tal vez es un poco menos óptimo, pero sin querer meterme muy profundo y agregar más librerías como GSAP por ejemplo, lo hace más prolijo y utilizable.

Continué expandiendo algunos átomos y generando los useState que mantienen el estado de la UI con respecto a sus distintos tipos de filtro, y elegí empezar con los distintos paneles que tienen información que me era simple de conseguir o ya estaba expuesta en algún lugar de la app, como las Tarjetas, Métodos de Pago y Cuotas. Estos tres paneles utilizan un patrón parecido sino igual a nivel presentación (Tags) y su filtrado fue relativamente directo, ya que sus relaciones ya estaban presentes y a mano en el contexto.

En primera instancia estos filtros solamente estaban afectando a la lista, pero eso me generó una desconexión importante entre la data presente en la parte superior y la inferior, por lo cual decidí expandir los filtros entre las dos. Lo cual afecta el total, pero permitiendo filtrar sin modificar la lista, su periodo de tiempo. Digase, puedo ver cuantas operaciones sucedieron a través de Mastercard y QR, y sin dejar de ver el historial total, puedo ver también los totales por periodos ya determinados.

### Calendario y rango de monto

Para estos dos filtros en particular, elegí utilizar dos componentes de librerías de mucho uso y standard en desarrollos en React y Next para no perder tiempo en la construcción de ambos, ya que en el diseño se pide funcionalidad que está por fuera de los elementos de input (range y date) defaults de HTML o tags que pudieran estar disponibles en Next. Para el calendario se utiliza react-day-picker, el cual se utiliza a su vez en varias librerías de UI como base para para sus propios elementos de calendario; y para el slider con doble thumb, elegí el react-slider de Radix UI, ya que también ofrece lo que necesitaba de manera modular sin necesitar agregar una librería entera de UI para solo utilizar ese componente.

En ambos, hay diferencias que pueden cerrarse con respecto al diseño, cuestiones plenas de UX/UI pero por una cuestión de tiempo, elegí dejarlas para una instancia a futuro ya que no afectan directamente al uso de los componentes, ni a sus filtros. En el caso del calendario, la diferencia mayor es el estilo de los bordes en la selección de fechas y en el caso del slider, que no aparezca el label flotante al tappear/seleccionar alguno de los dos thumbs, estas serían mejoras que se pueden resolver relativamente rápido, pero que requieren tiempo del que no dispongo.

Dicho esto, el rango de monto no afecta tanto a la lista, ni al total; simplemente funciona como un filtro más como el resto. Pero si, el calendario al afectar el periodo de tiempo al cual el usuario está haciendo referencia en la lista y el total disponible, elegí separarme un poco del diseño presente y al activarlo, que solo esté disponible el total en el rango de fechas elegido, sacandole la opción al usuario de filtrar este rango de fechas en los periodos ya predeterminados. En este caso, hay una discusión que se puede abrir en como es que los filtros predeterminados de periodos funcionan, porque si por ejemplo dan un promedio, que las tabs existan en este contexto es correcto, pero de no ser así y si el usuario elige un rango por fuera del mes actual, el total siempre daría 0 lo cual es una experiencia completamente innecesaria, que llevaría a esconder esa parte integral de la pantalla, generando un layout shift importante y una desconexión con respecto al uso.

### Toques finales y deploy

La app se ve bastante cercana al diseño con algunas mejoras desde el lado de UX y UI, y algunas otras cosas que inferí podrian afectarla positivamente a nivel lectura y presentación de la misma. Al terminarla, pusheé los cambios a Github e hice un deploy en Vercel para que lo puedan ver sin tener que traer el repo y correrlo localmente. Dicho esto, podría haber ido pusheando diariamente o a medida que iba completando features al repo, pero sinceramente no lo tuve en cuenta. En el caso de estar trabajando en una feature o producto en equipo y en otro formato, es lo que hubiera hecho normalmente, ya que al tener un historial de evolución de los archivos a veces es mejor ver instancias donde estuvo mejor o peor escrito, o donde hacía cosas distintas, y entender el flujo de pensamiento del dev.

Las métricas generales desde Vercel son buenas, tiene LPC: 1.96s, el componente que más tarda en renderear es el total en las métricas - 0 en CLS - 240/250ms en INP al cambiar de periodo, esto es afectado por el tiempo de animación más que nada y puede ser optimizado relativamente rápido. Las métricas de Lighthouse también son buenas, 92 Performance, 89 Accessiblity, 96 Best Practices y 100 de SEO, lo cual es normal en una microapp; pero en todos los casos, las mejoras que podrían aplicarse ya las nombré en algún otro momento en este readme.

Como últimas pasadas estoy integrando tests unitarios en los puntos críticos del sistema, si bien en esta instancia es algo que estoy resolviendo al final, es algo que con otra estructura y un equipo alrededor tal vez solucionaría on the go, a medida que se vayan resolviendo componentes puntuales para poder darles más contexto a mis compañeros y no romper la integración de componentes en una app.

También me separé un poco del diseño para darle más información de contexto al usuario con respecto a cuando selecciona un periodo custom de tiempo, y a que ventana de tiempo se refiere cuando elige alguno ed los filtros por default de la app.

## ¿Qué mejoras a futuro aplicaría?

- Instancia de loading para los componentes: Esto está presente en el diseño, pero elegí dejarlo para una instancia final ya que al tener un tiempo de carga bastante rápido es algo que no iba a afectar la UX. En el caso de crear un componente en un sistema más grande y complejo, posiblemente sea algo que desarrolle como segundo paso, después de definir el layout y estilo y antes de conectar la data al mismo.
- Descarga de un PDF con respecto a un rango de fechas: Infiero que en este caso, la idea es bajar un PDF de las operaciones con el rango de fechas que el usuario quiera, esto me requiere buscar alguna librería y leer documentación al respecto, me hubiera encantado pero no llegué con el tiempo disponible. Existe el átomo de Alert, que fue una de las primeras cosas que hice en el caso de que llegara pero no se dió.
- Discusión continua con el equipo de diseño para mejoras de sus entregables y su librería de uso: El archivo de Figma que se entrega con el challenge es confuso y en varias instancias mal armado (mal uso de autolayout, la mala construcción lleva a no tener información cohesiva o coherente con respecto a spacings, uso de distintas variables de diseño, etc); no llega al standard normal de un archivo que se pueda considerar SSOT y eso empuja a discusiones entre areas, y diferencias entre lo desarrollado y lo diseñado (en este caso elegí seguir mi instinto con algunas cosas y me separé del archivo de diseño en cuestiones que considero fallos o huecos entre UX, UI y FE).
- Mejorar y alinear los nombres, props y usos de componentes con respecto a las aclaraciones disponibles en los entregables de diseño
- Aplicar mejores ARIA-labels y hacer que la microapp pase cualquier clase de tests de WCAG y a11y. Al ser una app plena de mobile y un challenge, lo desestimé pero es algo que suma cuando está bien armado y genera una muy buena estructura a nivel código y diseño cuando se tiene en cuenta.
- Checkear donde es que estoy fallando el hydration, si bien esto no genera ningún issue importante en la app, en su build o en su deploy, hay algún nesting raro de tags que no veo pero seguramente sea fácil de encontrar.

### Gracias por leer

- [Mariano Nicolás Alfonso Colonna](https://www.linkedin.com/in/seuil/)
- [Portfolio](https://www.seuil.info/es)
