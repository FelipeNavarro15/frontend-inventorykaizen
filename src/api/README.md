# Estructura de API

Este proyecto utiliza una estructura centralizada para todas las llamadas a la API usando **Axios** en lugar de `fetch`.

## Estructura de Carpetas

```
src/
└── api/
    ├── config.js              # Configuración de axios
    ├── productos.js           # Operaciones CRUD de productos
    ├── ventas.js              # Operaciones CRUD de ventas
    ├── compras.js             # Operaciones CRUD de compras
    ├── comprasPadre.js        # Operaciones CRUD de compras padre
    └── inventario.js          # Operaciones de inventario
```

## Archivos de API

### `config.js`
Configuración centralizada de Axios con la URL base de la API obtenida de variables de entorno.

```javascript
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});
```

### `productos.js`
Funciones para gestionar productos:
- `fetchProductos()` - Obtener todos los productos
- `createProducto(data)` - Crear un nuevo producto
- `updateProducto(id, data)` - Actualizar un producto
- `deleteProducto(id)` - Eliminar un producto

### `ventas.js`
Funciones para gestionar ventas:
- `fetchVentas()` - Obtener todas las ventas
- `createVenta(data)` - Crear una nueva venta
- `updateVenta(id, data)` - Actualizar una venta
- `deleteVenta(id)` - Eliminar una venta

### `compras.js`
Funciones para gestionar compras:
- `fetchCompras()` - Obtener todas las compras
- `createCompra(data)` - Crear una nueva compra
- `updateCompra(id, data)` - Actualizar una compra
- `deleteCompra(id)` - Eliminar una compra

### `comprasPadre.js`
Funciones para gestionar compras padre (compras agrupadas):
- `fetchComprasPadre()` - Obtener todas las compras padre
- `createCompraPadre(data)` - Crear una nueva compra padre
- `updateCompraPadre(id, data)` - Actualizar una compra padre
- `deleteCompraPadre(id)` - Eliminar una compra padre

### `inventario.js`
Funciones para inventario:
- `fetchInventario()` - Obtener el estado del inventario
- `fetchReporteFinanciero()` - Obtener reporte financiero

## Uso en Componentes

### Antes (con fetch)
```javascript
const API_URL = import.meta.env.VITE_API_URL;

const handleCreate = async (data) => {
  await fetch(`${API_URL}/api/productos/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};
```

### Después (con axios)
```javascript
import { createProducto } from './api/productos';

const handleCreate = async (data) => {
  await createProducto(data);
};
```

## Variables de Entorno

El proyecto utiliza `VITE_API_URL` como variable de entorno. Asegúrate de que esté configurada en tu archivo `.env`:

```env
VITE_API_URL=https://tu-api-url.com
```

## Beneficios

✅ **Código más limpio** - Sin repetición de URLs
✅ **Mantenimiento centralizado** - Los cambios se hacen en un solo lugar
✅ **Mejor manejo de errores** - Usando Axios interceptores
✅ **Escalabilidad** - Fácil de agregar nuevas funciones
✅ **Reutilización** - Las funciones se pueden usar en múltiples componentes
✅ **Consistencia** - Todas las llamadas usan la misma configuración

## Próximos Pasos Opcionales

1. **Agregar interceptores** para autenticación
2. **Implementar retry logic** para llamadas fallidas
3. **Agregar logging** centralizado
4. **Implementar cache** con estrategias de revalidación
