# Auditoría Técnica y Análisis de UX - AuraVerde

**Fecha:** 20 de Diciembre, 2025
**Estado:** Pre-Producción (MVP Funcional)

---

## 🚦 Resumen de Estado (Semáforo)

| Módulo | Estado | Detalle |
| :--- | :---: | :--- |
| **Autenticación** | 🟢 **Listo** | Registro, Login, Verificación de Email, Roles (Admin/Cliente). Todo conectado a Firebase. |
| **Catálogo** | 🟢 **Listo** | Visualización, Filtros, Búsqueda, Favoritos sincronizados. UI Móvil optimizada. |
| **Carrito** | 🟢 **Listo** | Lógica completa, cálculo de impuestos, **persistencia en LocalStorage** (no se borra al recargar). |
| **Perfil** | 🟡 **Parcial** | Muestra datos reales y Favoritos. **Falta:** Gestión de Direcciones y Métodos de Pago. |
| **Checkout** | 🟡 **Simulado** | UI completa y validaciones básicas. **Falta:** Procesamiento real de pago y guardado de orden. |
| **Pagos** | 🔴 **Pendiente** | No hay integración con pasarela real (MercadoPago/Stripe). El botón "Pagar" solo simula una espera. |
| **Historial (Pedidos)** | 🔴 **Mock** | La página `/orders` muestra datos falsos de ejemplo. No lee de la base de datos real. |

---

## 🔍 Hallazgos Detallados

### 1. Checkout y Pagos (Crítico)

El componente `Checkout.jsx` tiene un formulario visualmente correcto, pero al dar click en "Pagar":

- Solo ejecuta un `setTimeout` de 2 segundos.
- Redirige a `/success` sin guardar nada en la base de datos.
- **Riesgo:** Si lanzamos así, los usuarios "comprarán" gratis y no tendremos registro de qué enviarnles.

### 2. Historial de Pedidos (`Orders.jsx`)

Actualmente usa una lista fija (`const orders = [...]`).

- Un usuario real verá siempre los mismos pedidos de ejemplo ("Echeveria Lola", etc.), no los que realmente compró.
- **Solución:** Necesitamos crear una colección `orders` en Firestore y leerla aquí filtrando por `uid`.

### 3. Direcciones de Envío

En el perfil hay un botón "Direcciones de Envío", pero es estético.

- No existe pantalla para agregar/editar direcciones.
- En el Checkout, el usuario debe escribir su dirección cada vez.
- **Mejora UX:** Guardar direcciones frecuentes en el perfil del usuario.

### 4. Persistencia del Carrito

**¡Buenas noticias!** `CartContext` ya guarda los items en el navegador (`localStorage`). Si el usuario cierra la pestaña y vuelve, sus productos siguen ahí. (Punto a favor ✅).

---

## 🚀 Plan de Acción Recomendado

Para convertir este prototipo en una tienda real funcional, sugiero atacar estos puntos en orden:

### Fase 1: Motor de Pedidos (Backend)

1. **Crear esquemas en Firestore**: Colección `orders`.
2. **Conectar Checkout**: Que al "Pagar" se cree un documento real en `orders` con los ítems del carrito.
3. **Conectar Historial**: Que la página "Mis Pedidos" lea de esa colección real.

### Fase 2: Direcciones (UX)

1. Crear subcolección `users/{uid}/addresses`.
2. Construir página "Mis Direcciones".
3. Permitir seleccionar dirección guardada en el Checkout para no re-escribir.

### Fase 3: Dinero Real (Pagos)

1. Integrar **MercadoPago** (Checkout Pro o API).
2. Reemplazar el botón simulado por el botón oficial de pago.
3. Validar confirmación de pago antes de crear la orden.

---

**¿Por dónde te gustaría empezar?** La **Fase 1** es la base para todo lo demás.
