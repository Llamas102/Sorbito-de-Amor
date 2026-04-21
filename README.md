# 🚀 Backend Sorbito de Amor - Sistema de Pagos con Mercado Pago

Backend completo para procesar pagos con Mercado Pago para la cafetería **Sorbito de Amor** en Saltillo, México.

---

## 📋 Información del Proyecto

- **Vendedor:** Juan Carlos Llamas Contreras
- **Email:** facturacion@sorbitodeamor.com
- **Teléfono:** 844 495 8409
- **Ubicación:** Blvd. Pedro Figueroa 966-2, Saltillo, México

---

## 🔧 Tecnologías

- Node.js 18+
- Express.js
- Mercado Pago SDK
- Axios
- CORS

---

## 📦 Instalación Local (Opcional)

```bash
# Clonar repositorio
git clone [tu-repo-url]
cd sorbito-backend

# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp .env.example .env

# Editar .env con tus credenciales (ya vienen configuradas)
nano .env

# Iniciar servidor
npm start
```

---

## 🌐 Desplegar en Render

### Paso 1: Preparar archivos

✅ Ya tienes todos los archivos listos:
- `server.js` - Servidor principal
- `package.json` - Dependencias
- `.env.example` - Variables de entorno

### Paso 2: Subir a Render

**OPCIÓN A: Desde repositorio público**

1. Sube estos archivos a un repositorio Git público (GitHub, GitLab, etc.)
2. En Render, selecciona "Public Git Repository"
3. Pega la URL de tu repositorio
4. Render auto-detecta que es Node.js

**OPCIÓN B: Subida manual**

1. En Render, selecciona "Build Command": `npm install`
2. "Start Command": `npm start`

### Paso 3: Configurar Variables de Entorno

En Render → Environment Variables, agrega:

```
MERCADOPAGO_ACCESS_TOKEN = APP_USR-3670843432334023-042116-eca6a87cc5ac7d6ce093c01fdecd8af3-3350578413

MERCADOPAGO_PUBLIC_KEY = APP_USR-87258bb7-c2d0-4a5d-a05e-dae843f8f322

SELLER_EMAIL = facturacion@sorbitodeamor.com

NODE_ENV = production

PORT = 3000
```

### Paso 4: Desplegar

1. Click en "Create Web Service"
2. Render construye automáticamente
3. ¡Listo! Te da una URL como: `https://sorbito-backend.onrender.com`

---

## 🔗 Actualizar Frontend

Una vez desplegado el backend, **actualiza tu archivo `sorbito.html`** en Netlify:

Busca esta línea en la función `confirmOrder()`:

```javascript
const res = await fetch("http://localhost:3000/pagar", {
```

Cámbiala por:

```javascript
const res = await fetch("https://TU-URL-DE-RENDER.onrender.com/api/pagar", {
```

---

## 📡 Endpoints Disponibles

### GET `/`
Health check del servidor

**Respuesta:**
```json
{
  "status": "ok",
  "message": "Sorbito de Amor - Backend de Pagos",
  "version": "1.0.0"
}
```

---

### POST `/api/pagar`
Procesar pago con Mercado Pago

**Request:**
```json
{
  "token": "token_de_mercadopago",
  "payment_method_id": "visa",
  "transaction_amount": 125.50,
  "installments": 1,
  "description": "Pedido Sorbito",
  "payer": {
    "email": "cliente@example.com"
  },
  "order_items": [...],
  "customer_name": "Juan Pérez",
  "customer_notes": "Sin azúcar"
}
```

**Respuesta exitosa:**
```json
{
  "status": "approved",
  "payment_id": "123456789",
  "status_detail": "accredited",
  "message": "Pago aprobado exitosamente",
  "order_number": "#1234"
}
```

**Respuesta error:**
```json
{
  "error": "Error procesando el pago",
  "message": "Tarjeta rechazada",
  "status": "rejected"
}
```

---

### POST `/api/notifications`
Webhook para notificaciones de Mercado Pago

Se activa automáticamente cuando hay cambios en el estado del pago.

---

### GET `/api/payment-methods`
Obtener métodos de pago disponibles

**Respuesta:**
```json
[
  {
    "id": "visa",
    "name": "Visa",
    "payment_type_id": "credit_card"
  },
  ...
]
```

---

## 🔐 Seguridad

- ✅ HTTPS obligatorio en producción
- ✅ CORS configurado
- ✅ Variables de entorno protegidas
- ✅ Validación de datos en cada request
- ✅ Manejo de errores global
- ✅ Logs de transacciones

---

## 📞 Soporte

**Email:** facturacion@sorbitodeamor.com  
**Teléfono:** 844 495 8409  
**Ubicación:** Blvd. Pedro Figueroa 966-2, Saltillo, México

---

## 📄 Licencia

MIT License - Sorbito de Amor © 2026

---

## ✅ Checklist de Despliegue

- [ ] Archivos subidos a repositorio Git
- [ ] Web Service creado en Render
- [ ] Variables de entorno configuradas
- [ ] Backend desplegado y funcionando
- [ ] URL del backend copiada
- [ ] Frontend actualizado con nueva URL
- [ ] Pago de prueba realizado exitosamente
- [ ] ¡Sistema funcionando! 🎉
