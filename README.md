# Kaizen F&F - ERP System (Frontend) 💻

Interfaz de usuario moderna y responsiva para el sistema ERP de **Kaizen F&F**. Esta aplicación consume la API de Django para gestionar inventarios y operaciones en tiempo real.

## 🚀 Despliegue

La aplicación se encuentra desplegada y funcional en:
👉 **[frontend-inventorykaizen.vercel.app](https://frontend-inventorykaizen.vercel.app)**

## 🛠️ Tecnologías Utilizadas

* **Framework:** [React 18](https://reactjs.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **HTTP Client:** [Axios](https://axios-http.com/) (para consumo de API)
* **Hosting:** [Vercel](https://vercel.com/)
* **Lenguaje:** JavaScript / HTML / CSS

## 📋 Funcionalidades

* **Dashboard de Inventario:** Visualización dinámica de productos.
* **Consumo de API:** Integración completa con el backend de Django REST Framework.
* **Diseño Responsivo:** Optimizado para su uso en diferentes dispositivos.
* **Gestión de Sesión:** Manejo de eventos de inicio de sesión y carga de datos persistente.

## 🔧 Instalación Local

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/FelipeNavarro15/frontend-inventorykaizen.git](https://github.com/FelipeNavarro15/frontend-inventorykaizen.git)
   cd frontend-inventorykaizen

2. **Instalar dependencias:**
   ```bash
   npm install

3. **Configurar variables de entorno:**
    Crea un archivo .env en la raíz y añade la URL de tu API:
   ```bash
   VITE_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)

4. **Correr en modo desarrollo::**
   ```bash
   npm run dev

⚙️ Backend Relacionado
Para que esta interfaz funcione correctamente, debe estar conectada al servidor de la API:

👉 [Repositorio del Backend](https://github.com/FelipeNavarro15/backend-inventorykaizen)

👤 Autor
Felipe Navarro - FelipeNavarro15