import http from 'http';
import express from 'express';
import { configExpress } from './config/express';
import { config } from './config/environment/';
import { initRoutes } from './routes';

// Setup server
export const app = express();
const server = http.createServer(app);
configExpress(app);
initRoutes(app);

server.listen(config.port, config.ip, () => {
  console.log(`Server is listening on http://${config.ip}:${config.port}, in ${app.get('env')} mode`);
});

