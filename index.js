const express = require('express');
const cors = require('cors');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');
const { connect } = require('./connect');

const { port, secret } = config;
const app = express();

app.set('config', config);
app.set('pkg', pkg);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authMiddleware(secret));

// Configura las CORS para permitir solicitudes desde 'https://burger-queen-api-client-psi.vercel.app'
app.use(cors({
  origin: ['https://burger-queen-api-client-psi.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));

// Registrar rutas
routes(app, (err) => {
  if (err) {
    throw err;
  }

  app.use(errorHandler);

  app.listen(port, () => {
    console.info(`App listening on port ${port}`);
  });
});

connect();
