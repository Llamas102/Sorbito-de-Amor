const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Sorbito de Amor - Backend de Pagos',
    version: '1.0.0'
  });
});

// Endpoint para procesar pagos
app.post('/api/pagar', async (req, res) => {
  try {
    const { 
      token, 
      payment_method_id, 
      transaction_amount, 
      installments, 
      description, 
      payer,
      order_items,
      customer_name,
      customer_notes
    } = req.body;

    // Validación de datos
    if (!token || !payment_method_id || !transaction_amount) {
      return res.status(400).json({ 
        error: 'Datos incompletos',
        message: 'Faltan datos requeridos para procesar el pago'
      });
    }

    // Crear el pago en Mercado Pago
    const payment = await axios.post('https://api.mercadopago.com/v1/payments', {
      token: token,
      payment_method_id: payment_method_id,
      transaction_amount: parseFloat(transaction_amount),
      installments: parseInt(installments) || 1,
      description: description || 'Pedido Sorbito de Amor',
      payer: {
        email: payer?.email || 'cliente@sorbitodeamor.com'
      },
      statement_descriptor: 'SORBITO DE AMOR',
      notification_url: process.env.NOTIFICATION_URL,
      metadata: {
        customer_name: customer_name,
        customer_notes: customer_notes,
        order_items: JSON.stringify(order_items)
      }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    // Log del pago exitoso
    console.log('✅ Pago procesado:', {
      payment_id: payment.data.id,
      status: payment.data.status,
      amount: payment.data.transaction_amount,
      customer: customer_name
    });

    // Responder con éxito
    res.json({
      status: payment.data.status,
      payment_id: payment.data.id,
      status_detail: payment.data.status_detail,
      message: payment.data.status === 'approved' 
        ? 'Pago aprobado exitosamente' 
        : 'Pago en proceso de verificación',
      order_number: `#${Math.floor(Math.random() * 9000) + 1000}`
    });

  } catch (error) {
    console.error('❌ Error procesando pago:', error.response?.data || error.message);
    
    // Respuesta detallada de error
    res.status(400).json({
      error: 'Error procesando el pago',
      message: error.response?.data?.message || 'Hubo un problema al procesar tu pago. Por favor intenta de nuevo.',
      details: error.response?.data?.cause || [],
      status: 'rejected'
    });
  }
});

// Endpoint para notificaciones de Mercado Pago (webhooks)
app.post('/api/notifications', async (req, res) => {
  try {
    const { type, data } = req.body;
    
    console.log('📬 Notificación recibida:', { type, data });

    if (type === 'payment') {
      const paymentId = data.id;
      
      // Obtener detalles del pago
      const payment = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
        }
      });

      console.log('💳 Estado del pago:', {
        id: payment.data.id,
        status: payment.data.status,
        amount: payment.data.transaction_amount
      });

      // Aquí puedes agregar lógica adicional:
      // - Enviar email al vendedor
      // - Actualizar base de datos
      // - Notificar al cliente
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Error procesando notificación:', error.message);
    res.status(500).send('Error');
  }
});

// Endpoint para obtener métodos de pago disponibles
app.get('/api/payment-methods', async (req, res) => {
  try {
    const response = await axios.get('https://api.mercadopago.com/v1/payment_methods', {
      headers: {
        'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('❌ Error obteniendo métodos de pago:', error.message);
    res.status(500).json({ error: 'Error obteniendo métodos de pago' });
  }
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error del servidor:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: 'Ocurrió un error inesperado. Por favor contacta a soporte.'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🚀 Servidor iniciado exitosamente   ║
║                                       ║
║   Puerto: ${PORT}                        ║
║   Entorno: ${process.env.NODE_ENV || 'development'}              ║
║   Mercado Pago: ✅ Configurado        ║
║                                       ║
║   Endpoints disponibles:              ║
║   GET  /                              ║
║   POST /api/pagar                     ║
║   POST /api/notifications             ║
║   GET  /api/payment-methods           ║
╚═══════════════════════════════════════╝
  `);
});

module.exports = app;
