const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/usuarios';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB - Usuarios'))
  .catch(err => console.log('Error conectando a MongoDB:', err.message));

// Schema de Usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: '123456' },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Variables para status
const startTime = new Date();

// Datos simulados (fallback si MongoDB no está disponible)
const usuariosSimulados = [
  { id: 1, username: 'admin', email: 'admin@abc.com', role: 'admin', createdAt: '2024-01-01' },
  { id: 2, username: 'usuario', email: 'usuario@abc.com', role: 'user', createdAt: '2024-01-02' },
  { id: 3, username: 'juan', email: 'juan@abc.com', role: 'user', createdAt: '2024-01-03' },
  { id: 4, username: 'maria', email: 'maria@abc.com', role: 'user', createdAt: '2024-01-04' }
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
    service: 'usuarios-service',
    timestamp: new Date().toISOString(),
    database: isMongoConnected() ? 'connected' : 'disconnected'
  });
});

// Status detallado
app.get('/status', (req, res) => {
  const uptime = Math.floor((new Date() - startTime) / 1000);
  res.json({
    status: 'running',
    service: 'usuarios-service',
    version: '1.0.0',
    uptime: `${uptime} segundos`,
    startTime: startTime.toISOString(),
    database: isMongoConnected() ? 'connected' : 'disconnected',
    mongoUri: MONGODB_URI.replace(/\/\/.*@/, '//***@'), // Ocultar credenciales
    endpoints: ['GET /health', 'GET /status', 'GET /api/users', 'POST /api/users'],
    memory: process.memoryUsage()
  });
});

// =====================
// ENDPOINTS DE USUARIOS
// =====================

// GET - Obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  console.log('GET /api/users - Listando usuarios');
  
  try {
    if (isMongoConnected()) {
      const users = await User.find().select('-password');
      return res.json({
        success: true,
        source: 'mongodb',
        count: users.length,
        data: users
      });
    }
  } catch (error) {
    console.log('Error en MongoDB, usando datos simulados:', error.message);
  }
  
  // Fallback a datos simulados
  res.json({
    success: true,
    source: 'simulated',
    count: usuariosSimulados.length,
    data: usuariosSimulados
  });
});

// GET - Obtener usuario por ID
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`GET /api/users/${id}`);
  
  try {
    if (isMongoConnected()) {
      const user = await User.findById(id).select('-password');
      if (user) {
        return res.json({ success: true, source: 'mongodb', data: user });
      }
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
  } catch (error) {
    // Si el ID no es válido para MongoDB, buscar en simulados
    console.log('Buscando en datos simulados');
  }
  
  // Fallback a datos simulados
  const usuario = usuariosSimulados.find(u => u.id === parseInt(id));
  if (usuario) {
    res.json({ success: true, source: 'simulated', data: usuario });
  } else {
    res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  }
});

// POST - Crear nuevo usuario
app.post('/api/users', async (req, res) => {
  const { username, email, role } = req.body;
  console.log('POST /api/users - Creando usuario:', username);
  
  // Validación
  if (!username || !email) {
    return res.status(400).json({
      success: false,
      message: 'Username y email son requeridos'
    });
  }
  
  try {
    if (isMongoConnected()) {
      const nuevoUsuario = new User({
        username,
        email,
        role: role || 'user'
      });
      
      await nuevoUsuario.save();
      
      return res.status(201).json({
        success: true,
        source: 'mongodb',
        message: 'Usuario creado exitosamente',
        data: nuevoUsuario
      });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El username o email ya existe'
      });
    }
    console.log('Error en MongoDB:', error.message);
  }
  
  // Fallback a datos simulados
  const nuevoUsuario = {
    id: usuariosSimulados.length + 1,
    username,
    email,
    role: role || 'user',
    createdAt: new Date().toISOString()
  };
  
  usuariosSimulados.push(nuevoUsuario);
  
  res.status(201).json({
    success: true,
    source: 'simulated',
    message: 'Usuario creado exitosamente',
    data: nuevoUsuario
  });
});

// PUT - Actualizar usuario
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, role, status } = req.body;
  console.log(`PUT /api/users/${id} - Actualizando usuario`);
  
  try {
    if (isMongoConnected()) {
      const user = await User.findByIdAndUpdate(
        id,
        { username, email, role, status },
        { new: true, runValidators: true }
      ).select('-password');
      
      if (user) {
        return res.json({ success: true, source: 'mongodb', data: user });
      }
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.log('Error en MongoDB:', error.message);
  }
  
  // Fallback a datos simulados
  const index = usuariosSimulados.findIndex(u => u.id === parseInt(id));
  if (index !== -1) {
    usuariosSimulados[index] = { ...usuariosSimulados[index], username, email, role };
    res.json({ success: true, source: 'simulated', data: usuariosSimulados[index] });
  } else {
    res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  }
});

// DELETE - Eliminar usuario
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /api/users/${id} - Eliminando usuario`);
  
  try {
    if (isMongoConnected()) {
      const user = await User.findByIdAndDelete(id);
      if (user) {
        return res.json({ success: true, source: 'mongodb', message: 'Usuario eliminado', data: user });
      }
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.log('Error en MongoDB:', error.message);
  }
  
  // Fallback a datos simulados
  const index = usuariosSimulados.findIndex(u => u.id === parseInt(id));
  if (index !== -1) {
    const eliminado = usuariosSimulados.splice(index, 1);
    res.json({ success: true, source: 'simulated', message: 'Usuario eliminado', data: eliminado[0] });
  } else {
    res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Servicio de Usuarios - ABC Platform',
    version: '1.0.0',
    database: isMongoConnected() ? 'MongoDB conectado' : 'Modo simulado',
    endpoints: {
      health: 'GET /health',
      status: 'GET /status',
      listar: 'GET /api/users',
      obtener: 'GET /api/users/:id',
      crear: 'POST /api/users',
      actualizar: 'PUT /api/users/:id',
      eliminar: 'DELETE /api/users/:id'
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
  ---
  SERVICIO DE USUARIOS
  Puerto: ${PORT}
  Estado: Activo
  MongoDB: ${MONGODB_URI.split('/').pop()}
  ---
  `);
});