// Crear base de datos de Usuarios
db = db.getSiblingDB('usuarios');

db.createCollection('users');

db.users.insertMany([
  {
    username: 'admin',
    email: 'admin@abc.com',
    password: '123456',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2024-01-01')
  },
  {
    username: 'usuario',
    email: 'usuario@abc.com',
    password: '123456',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-01-02')
  },
  {
    username: 'juan',
    email: 'juan@abc.com',
    password: '123456',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-01-03')
  },
  {
    username: 'maria',
    email: 'maria@abc.com',
    password: '123456',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-01-04')
  }
]);

print('Base de datos de Usuarios inicializada');

// Crear base de datos de Pedidos
db = db.getSiblingDB('pedidos');

db.createCollection('orders');

db.orders.insertMany([
  {
    userId: 2,
    items: [
      { productId: 101, name: 'Laptop HP', quantity: 1, price: 899.99 },
      { productId: 102, name: 'Mouse Logitech', quantity: 2, price: 29.99 }
    ],
    total: 959.97,
    status: 'processing',
    createdAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    userId: 3,
    items: [
      { productId: 103, name: 'Teclado Mecánico', quantity: 1, price: 149.99 }
    ],
    total: 149.99,
    status: 'shipped',
    createdAt: new Date('2024-01-14T15:45:00Z')
  },
  {
    userId: 2,
    items: [
      { productId: 104, name: 'Monitor 27"', quantity: 1, price: 349.99 },
      { productId: 105, name: 'Cable HDMI', quantity: 2, price: 15.99 }
    ],
    total: 381.97,
    status: 'delivered',
    createdAt: new Date('2024-01-10T09:00:00Z')
  },
  {
    userId: 4,
    items: [
      { productId: 106, name: 'Webcam HD', quantity: 1, price: 79.99 }
    ],
    total: 79.99,
    status: 'pending',
    createdAt: new Date('2024-01-16T14:20:00Z')
  }
]);

print('Base de datos de Pedidos inicializada');

// Crear base de datos de Pagos
db = db.getSiblingDB('pagos');

db.createCollection('payments');

db.payments.insertMany([
  {
    orderId: 1,
    userId: 2,
    amount: 959.97,
    method: 'credit_card',
    status: 'completed',
    transactionId: 'TXN1705312200ABC123',
    createdAt: new Date('2024-01-15T10:35:00Z')
  },
  {
    orderId: 2,
    userId: 3,
    amount: 149.99,
    method: 'paypal',
    status: 'completed',
    transactionId: 'TXN1705245900DEF456',
    createdAt: new Date('2024-01-14T15:50:00Z')
  },
  {
    orderId: 3,
    userId: 2,
    amount: 381.97,
    method: 'debit_card',
    status: 'completed',
    transactionId: 'TXN1704877200GHI789',
    createdAt: new Date('2024-01-10T09:10:00Z')
  },
  {
    orderId: 4,
    userId: 4,
    amount: 79.99,
    method: 'credit_card',
    status: 'pending',
    transactionId: 'TXN1705415200JKL012',
    createdAt: new Date('2024-01-16T14:25:00Z')
  }
]);

print('Base de datos de Pagos inicializada');

print('Todas las bases de datos han sido inicializadas correctamente');