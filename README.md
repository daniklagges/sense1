# sense1
💳 Billetera Digital – Proyecto Frontend

Mini aplicación web de billetera digital desarrollada con HTML, CSS, Bootstrap y JavaScript, orientada a simular el flujo básico de una wallet: inicio de sesión, visualización de saldo, depósitos, envío de dinero y revisión de movimientos.

Proyecto pensado como ejercicio práctico de frontend, con foco en estructura, usabilidad y manejo de estado en el navegador.

🚀 Funcionalidades

✔ Inicio de sesión (simulado, sin backend)
✔ Visualización de saldo en tiempo real
✔ Depósitos de dinero
✔ Envío de dinero a contactos
✔ Agenda de contactos (agregar y buscar)
✔ Registro de últimos movimientos
✔ Persistencia de datos con localStorage
✔ Diseño responsive con Bootstrap 5

🧱 Estructura del proyecto
billetera-digital/
│
├── login.html          # Pantalla de inicio de sesión
├── menu.html           # Menú principal y saldo
├── deposit.html        # Depósitos de dinero
├── sendmoney.html      # Envío de dinero y agenda
├── transactions.html  # Historial de movimientos
│
└── assets/
    ├── css/
    │   └── styles.css  # Estilos personalizados
    └── js/
        └── app.js      # Lógica principal de la aplicación

🖥️ Tecnologías utilizadas

HTML5 – Estructura semántica

CSS3 – Estilos personalizados

Bootstrap 5.3 – Diseño responsive y componentes UI

JavaScript (ES6) – Lógica de negocio

localStorage – Persistencia de datos en el navegador

🔐 Gestión de estado

La aplicación utiliza localStorage para almacenar:

Usuario autenticado

Saldo de la billetera

Historial de transacciones

Contactos de la agenda

No existe backend ni base de datos externa; todo se ejecuta en el navegador.

▶️ Cómo ejecutar el proyecto

Clona o descarga el repositorio

Abre la carpeta en Visual Studio Code

Instala la extensión Live Server

Haz clic derecho en login.html → Open with Live Server

💡 Para efectos de prueba, cualquier email y contraseña son válidos.

🧪 Flujo de uso

Iniciar sesión

Acceder al menú principal

Consultar saldo

Realizar depósitos

Enviar dinero a contactos

Revisar últimos movimientos

📌 Consideraciones

Proyecto 100% frontend

No incluye validaciones de seguridad reales

No apto para uso productivo

Enfocado en aprendizaje y demostración de habilidades

🔮 Posibles mejoras futuras

Autenticación real

Confirmación de operaciones

Notificaciones con Toasts

Filtros en movimientos

Integración con backend (API REST)

Gráficos de gastos e ingresos

📄 Licencia

Proyecto de uso educativo y demostrativo.
Libre de modificar y reutilizar con fines de aprendizaje.