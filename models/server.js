const express = require('express');
const cors = require('cors');
const { db } = require('../database/db');
const { repairRouter } = require('../routes/repair.routes');
const { userRouter } = require('../routes/user.routes');
const initModel = require('./initModel');
const AppError = require('../utils/app.Error');
const { authRouter } = require('../routes/auth.routes');
const morgan = require('morgan');
const globalErrorHandler = require('../controllers/error.controller');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;
    this.paths = {
      user: '/api/v1/user',
      repair: '/api/v1/repair',
      auth: '/api/v1/auth',
    };
    this.database();
    this.middlewares();
    this.routes();
  }
  middlewares() {
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }
    this.app.use(cors());
    this.app.use(express.json());
  }
  routes() {
    this.app.use(this.paths.repair, repairRouter);
    this.app.use(this.paths.user, userRouter);
    this.app.use(this.paths.auth, authRouter);
    this.app.all('*', (req, res, next) => {
      return next(
        new AppError(`can't find ${req.originalUrl} on this server!`, 404)
      );
    });
    this.app.use(globalErrorHandler);
  }
  database() {
    db.authenticate()
      .then(() => console.log('Database authenticated'))
      .catch(error => console.log(error));

    //relations
    initModel();

    db.sync()
      .then(() => console.log('Database synced'))
      .catch(error => console.log(error));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log('Server is running on port', this.port);
    });
  }
}
module.exports = Server;
