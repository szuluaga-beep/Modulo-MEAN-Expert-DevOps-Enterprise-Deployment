db = db.getSiblingDB('meandb');

db.createCollection('users');
db.users.insert({
  name: 'Usuario Demo',
  email: 'demo@mean.app',
  createdAt: new Date()
});

print('Base de datos inicializada correctamente');
