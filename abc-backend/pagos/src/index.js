const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pagos';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB - Pagos'))
  .catch(err => console.log('Error conectando a MongoDB:', err.message));

// Schema de Pago
const paymentSchema = new mongoose.Schema({
  orderId: { type: Number, required: true },
  userId: { type: Number, required: true },
  amount: { type: Number, required: true },
  method: { 
    type: String, 
    enum: ['credit_card', 'debit_card', 'paypal', 'transfer'],
    default: 'credit_card'
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: { type: String, required: true },
  refundTransactionId: String,
  refundedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

// Variables para status
const startTime = new Date();

// Función para generar ID de transacción
const generateTransactionId = () => {
  return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Datos simulados (fallback)
const pagosSimulados = [
  {
    id: 1,
    orderId: 1,
    userId: 2,
    amount: 959.97,
    method: 'credit_card',
    status: 'completed',
    transactionId: 'TXN1705312200ABC123',
    createdAt: '2024-01-15T10:35:00Z'
  },
  {
    id: 2,
    orderId: 2,
    userId: 3,
    amount: 149.99,
    method: 'paypal',
    status: 'completed',
    transactionId: 'TXN1705245900DEF456',
    createdAt: '2024-01-14T15:50:00Z'
  },
  {
    id: 3,
    orderId: 3,
    userId: 2,
    amount: 381.97,
    method: 'debit_card',
    status: 'completed',
    transactionId: 'TXN1704877200GHI789',
    createdAt: '2024-01-10T09:10:00Z'
  },
  {
    id: 4,
    orderId: 4,
    userId: 4,
    amount: 79.99,
    method: 'credit_card',
    status: 'pending',
    transactionId: 'TXN1705415200JKL012',
    createdAt: '2024-01-16T14:25:00Z'
  }
];

// Helper para verificar conexión a MongoDB
const isMongoConnected = () => mongoose.connection.readyState === 1;

// =====================
// ENDPOINTS REQUERIDOS
// =====================

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'pagos-service',
    timestamp: new Date().toISOString(),
    database: isMongoConnected() ? 'connected' : 'disconnected'
  });
});

// Status detallado
app.get('/status', (req, res) => {
  const uptime = Math.floor((new Date() - startTime) / 1000);
  res.json({
    status: 'running',
    service: 'pagos-service',
    version: '1.0.0',
    uptime: `${uptime} segundos`,
    startTime: startTime.toISOString(),
    database: isMongoConnected() ? 'connected' : 'disconnected',
    endpoints: ['GET /health', 'GET /status', 'GET /api/payments', 'POST /api/payments'],
    memory: process.memoryUsage()
  });
});

// =====================
// ENDPOINTS DE PAGOS
// =====================

// GET - Obtener todos los pagos
app.get('/api/payments', async (req, res) => {
  console.log('GET /api/payments - Listando pagos');
  
  try {
    if (isMongoConnected()) {
      const payments = await Payment.find().sort({ createdAt: -1 });
      return res.json({
        success: true,
        source: 'mongodb',
        count: payments.length,
        data: payments
      });
    }
  } catch (error) {
    console.log('Error en MongoDB:', error.message);
  }
  
  res.json({
    success: true,
    source: 'simulated',
    count: pagosSimulados.length,
    data: pagosSimulados
  });
});

// GET - Obtener pago por ID
app.get('/api/payments/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`GET /api/payments/${id}`);
  
  try {
    if (isMongoConnected()) {
      const payment = await Payment.findById(id);
      if (payment) {
        return res.json({ success: true, source: 'mongodb', data: payment });
      }
      return res.status(404).json({ success: false, message: 'Pago no encontrado' });
    }
  } catch (error) {
    console.log('Buscando en datos simulados');
  }
  
  const pago = pagosSimulados.find(p => p.id === parseInt(id));
  if (pago) {
    res.json({ success: true, source: 'simulated', data: pago });
  } else {
    res.status(404).json({ success: false, message: 'Pago no encontrado' });
  }
});

// GET - Obtener pagos por orden
app.get('/api/payments/order/:orderId', async (req, res) => {
  const { orderId } = req.params;
  console.log(`GET /api/payments/order/${orderId}`);
  
  try {
    if (isMongoConnected()) {
      const payments = await Payment.find({ orderId: parseInt(orderId) });
      return res.json({
        success: true,
        source: 'mongodb',
        count: payments.length,
        data: payments
      });
    }
  } catch (error) {
    console.log('Error en MongoDB:', error.message);
  }
  
  const pagos = pagosSimulados.filter(p => p.orderId === parseInt(orderId));
  res.json({
    success: true,
    source: 'simulated',
    count: pagos.length,
    data: pagos
  });
});

// POST - Procesar pago
app.post('/api/payments', async (req, res) => {
  const { orderId, userId, amount, method } = req.body;
  console.log('POST /api/payments - Procesando pago');
  
  const validMethods = ['credit_card', 'debit_card', 'paypal', 'transfer'];
  if (method && !validMethods.includes(method)) {
    return res.status(400).json({
      success: false,
      message: 'Método de pago inválido',
      validMethods
    });
  }
  
  // Simular procesamiento (90% éxito)
  const isSuccessful = Math.random() > 0.1;
  const transactionId = generateTransactionId();
  
  try {
    if (isMongoConnected()) {
      const nuevoPago = new Payment({
        orderId,
        userId,
        amount,
        method: method || 'credit_card',
        status: isSuccessful ? 'completed' : 'failed',
        transactionId
      });
      
      await nuevoPago.save();
      
      return res.status(isSuccessful ? 201 : 402).json({
        success: isSuccessful,
        source: 'mongodb',
        message: isSuccessful ? 'Pago procesado exitosamente' : 'Error al procesar el pago',
        data: nuevoPago
      });
    }
  } catch (error) {
    console.log('Error en MongoDB:', error.message);
  }
  
  const nuevoPago = {
    id: pagosSimulados.length + 1,
    orderId,
    userId,
    amount,
    method: method || 'credit_card',
    status: isSuccessful ? 'completed' : 'failed',
    transactionId,
    createdAt: new Date().toISOString()
  };
  
  pagosSimulados.push(nuevoPago);
  
  res.status(isSuccessful ? 201 : 402).json({
    success: isSuccessful,
    source: 'simulated',
    message: isSuccessful ? 'Pago procesado exitosamente' : 'Error al procesar el pago',
    data: nuevoPago
  });
});

// POST - Reembolsar pago
app.post('/api/payments/:id/refund', async (req, res) => {
  const { id } = req.params;
  console.log(`POST /api/payments/${id}/refund - Procesando reembolso`);
  
  try {
    if (isMongoConnected()) {
      const payment = await Payment.findById(id);
      
      if (!payment) {
        return res.status(404).json({ success: false, message: 'Pago no encontrado' });
      }
      
      if (payment.status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Solo se pueden reembolsar pagos completados'
        });
      }
      
      payment.status = 'refunded';
      payment.refundedAt = new Date();
      payment.refundTransactionId = generateTransactionId();
      await payment.save();
      
      return res.json({
        success: true,
        source: 'mongodb',
        message: 'Reembolso procesado exitosamente',
        data: payment
      });
    }
  } catch (error) {
    console.log('Error en MongoDB:', error.message);
  }
  
  const index = pagosSimulados.findIndex(p => p.id === parseInt(id));
  if (index !== -1) {
    if (pagosSimulados[index].status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden reembolsar pagos completados'
      });
    }
    
    pagosSimulados[index].status = 'refunded';
    pagosSimulados[index].refundedAt = new Date().toISOString();
    pagosSimulados[index].refundTransactionId = generateTransactionId();
    
    res.json({
      success: true,
      source: 'simulated',
      message: 'Reembolso procesado exitosamente',
      data: pagosSimulados[index]
    });
  } else {
    res.status(404).json({ success: false, message: 'Pago no encontrado' });
  }
});

// GET - Estadísticas de pagos
app.get('/api/payments/stats/summary', async (req, res) => {
  console.log('GET /api/payments/stats/summary');
  
  try {
    if (isMongoConnected()) {
      const payments = await Payment.find();
      const completed = payments.filter(p => p.status === 'completed');
      const totalAmount = completed.reduce((sum, p) => sum + p.amount, 0);
      
      return res.json({
        success: true,
        source: 'mongodb',
        data: {
          totalTransactions: payments.length,
          completedTransactions: completed.length,
          pendingTransactions: payments.filter(p => p.status === 'pending').length,
          failedTransactions: payments.filter(p => p.status === 'failed').length,
          refundedTransactions: payments.filter(p => p.status === 'refunded').length,
          totalAmount: Math.round(totalAmount * 100) / 100
        }
      });
    }
  } catch (error) {
    console.log('Error en MongoDB:', error.message);
  }
  
  const completed = pagosSimulados.filter(p => p.status === 'completed');
  const totalAmount = completed.reduce((sum, p) => sum + p.amount, 0);
  
  res.json({
    success: true,
    source: 'simulated',
    data: {
      totalTransactions: pagosSimulados.length,
      completedTransactions: completed.length,
      pendingTransactions: pagosSimulados.filter(p => p.status === 'pending').length,
      failedTransactions: pagosSimulados.filter(p => p.status === 'failed').length,
      refundedTransactions: pagosSimulados.filter(p => p.status === 'refunded').length,
      totalAmount: Math.round(totalAmount * 100) / 100
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Servicio de Pagos - ABC Platform',
    version: '1.0.0',
    database: isMongoConnected() ? 'MongoDB conectado' : 'Modo simulado',
    endpoints: {
      health: 'GET /health',
      status: 'GET /status',
      listar: 'GET /api/payments',
      obtener: 'GET /api/payments/:id',
      porOrden: 'GET /api/payments/order/:orderId',
      procesar: 'POST /api/payments',
      reembolsar: 'POST /api/payments/:id/refund',
      estadisticas: 'GET /api/payments/stats/summary'
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
  ---
  SERVICIO DE PAGOS
  Puerto: ${PORT}
  Estado: Activo
  ---
  `);
});