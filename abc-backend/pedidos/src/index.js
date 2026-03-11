const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pedidos';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB - Pedidos'))
  .catch(err => console.log('Error conectando a MongoDB:', err.message));

// Schema de Pedido
const orderSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  items: [{
    productId: Number,
    name: String,
    quantity: Number,
    price: Number
  }],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Variables para status
const startTime = new Date();

// Datos simulados (fallback)
const pedidosSimulados = [
  {
    id: 1,
    userId: 2,
    items: [
      { productId: 101, name: 'Laptop HP', quantity: 1, price: 899.99 },
      { productId: 102, name: 'Mouse Logitech', quantity: 2, price: 29.99 }
    ],
    total: 959.97,
    status: 'processing',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    userId: 3,
    items: [{ productId: 103, name: 'Teclado Mecánico', quantity: 1, price: 149.99 }],
    total: 149.99,
    status: 'shipped',
    createdAt: '2024-01-14T15:45:00Z'
  },
  {
    id: 3,
    userId: 2,
    items: [
      { productId: 104, name: 'Monitor 27"', quantity: 1, price: 349.99 },
      { productId: 105, name: 'Cable HDMI', quantity: 2, price: 15.99 }
    ],
    total: 381.97,
    status: 'delivered',
    createdAt: '2024-01-10T09:00:00Z'
  },
  {
    id: 4,
    userId: 4,
    items: [{ productId: 106, name: 'Webcam HD', quantity: 1, price: 79.99 }],
    total: 79.99,
    status: 'pending',
    createdAt: '2024-01-16T14:20:00Z'
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
    service: 'pedidos-service',
    timestamp: new Date().toISOString(),
    database: isMongoConnected() ? 'connected' : 'disconnected'
  });
});

// Status detallado
app.get('/status', (req, res) => {
  const uptime = Math.floor((new Date() - startTime) / 1000);
  res.json({
    status: 'running',
    service: 'pedidos-service',
    version: '1.0.0',
    uptime: `${uptime} segundos`,
    startTime: startTime.toISOString(),
    database: isMongoConnected() ? 'connected' : 'disconnected',
    endpoints: ['GET /health', 'GET /status', 'GET /api/orders', 'POST /api/orders'],
    memory: process.memoryUsage()
  });
});

// =====================
// ENDPOINTS DE PEDIDOS
// =====================

// GET - Obtener todos los pedidos
app.get('/api/orders', async (req, res) => {
  console.log('GET /api/orders - Listando pedidos');
  
  try {
    if (isMongoConnected()) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json({
        success: true,
        source: 'mongodb',
        count: orders.length,
        data: orders
      });
    }
  } catch (error) {
    console.log('Error en MongoDB:', error.message);
  }
  
  res.json({
    success: true,
    source: 'simulated',
    count: pedidosSimulados.length,
    data: pedidosSimulados
  });
});

// GET - Obtener pedido por ID
app.get('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`GET /api/orders/${id}`);
  
  try {
    if (isMongoConnected()) {
      const order = await Order.findById(id);
      if (order) {
        return res.json({ success: true, source: 'mongodb', data: order });
      }
      return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.log('Buscando en datos simulados');
  }
  
  const pedido = pedidosSimulados.find(p => p.id === parseInt(id));
  if (pedido) {
    res.json({ success: true, source: 'simulated', data: pedido });
  } else {
    res.status(404).json({ success: false, message: 'Pedido no encontrado' });
  }
});

// GET - Obtener pedidos por usuario
app.get('/api/orders/user/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log(`GET /api/orders/user/${userId}`);
  
  try {
    if (isMongoConnected()) {
      const orders = await Order.find({ userId: parseInt(userId) });
      return res.json({
        success: true,
        source: 'mongodb',
        count: orders.length,
        data: orders
      });
    }
  } catch (error) {
    console.log('Error en MongoDB:', error.message);
  }
  
  const pedidos = pedidosSimulados.filter(p => p.userId === parseInt(userId));
  res.json({
    success: true,
    source: 'simulated',
    count: pedidos.length,
    data: pedidos
  });
});

// POST - Crear nuevo pedido
app.post('/api/orders', async (req, res) => {
  const { userId, items } = req.body;
  console.log('POST /api/orders - Creando pedido');
  
  const total = items ? items.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0;
  
  try {
    if (isMongoConnected()) {
      const nuevoPedido = new Order({
        userId,
        items: items || [],
        total: Math.round(total * 100) / 100,
        status: 'pending'
      });
      
      await nuevoPedido.save();
      
      return res.status(201).json({
        success: true,
        source: 'mongodb',
        message: 'Pedido creado exitosamente',
        data: nuevoPedido
      });
    }
  } catch (error) {
    console.log('Error en MongoDB:', error.message);
  }
  
  const nuevoPedido = {
    id: pedidosSimulados.length + 1,
    userId,
    items: items || [],
    total: Math.round(total * 100) / 100,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  pedidosSimulados.push(nuevoPedido);
  
  res.status(201).json({
    success: true,
    source: 'simulated',
    message: 'Pedido creado exitosamente',
    data: nuevoPedido
  });
});

// PUT - Actualizar estado del pedido
app.put('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log(`PUT /api/orders/${id}/status - Estado: ${status}`);
  
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Estado inválido',
      validStatuses 
    });
  }
  
  try {
    if (isMongoConnected()) {
      const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
      if (order) {
        return res.json({ success: true, source: 'mongodb', data: order });
      }
      return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.log('Error en MongoDB:', error.message);
  }
  
  const index = pedidosSimulados.findIndex(p => p.id === parseInt(id));
  if (index !== -1) {
    pedidosSimulados[index].status = status;
    res.json({ success: true, source: 'simulated', data: pedidosSimulados[index] });
  } else {
    res.status(404).json({ success: false, message: 'Pedido no encontrado' });
  }
});

// DELETE - Cancelar pedido
app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /api/orders/${id} - Cancelando pedido`);
  
  try {
    if (isMongoConnected()) {
      const order = await Order.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
      if (order) {
        return res.json({ success: true, source: 'mongodb', message: 'Pedido cancelado', data: order });
      }
      return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.log('Error en MongoDB:', error.message);
  }
  
  const index = pedidosSimulados.findIndex(p => p.id === parseInt(id));
  if (index !== -1) {
    pedidosSimulados[index].status = 'cancelled';
    res.json({ success: true, source: 'simulated', message: 'Pedido cancelado', data: pedidosSimulados[index] });
  } else {
    res.status(404).json({ success: false, message: 'Pedido no encontrado' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Servicio de Pedidos - ABC Platform',
    version: '1.0.0',
    database: isMongoConnected() ? 'MongoDB conectado' : 'Modo simulado',
    endpoints: {
      health: 'GET /health',
      status: 'GET /status',
      listar: 'GET /api/orders',
      obtener: 'GET /api/orders/:id',
      porUsuario: 'GET /api/orders/user/:userId',
      crear: 'POST /api/orders',
      actualizarEstado: 'PUT /api/orders/:id/status',
      cancelar: 'DELETE /api/orders/:id'
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
  ---
  SERVICIO DE PEDIDOS
  Puerto: ${PORT}
  Estado: Activo
  ---
  `);
});