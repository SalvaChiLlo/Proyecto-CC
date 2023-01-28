import http from 'http';
import express from 'express';
import { config } from './config/environment/';
import { writeFileSync } from 'fs';

writeConfigFile();
export const app = express();
const server = http.createServer(app);
// Setup server
import { configExpress } from './config/express';
configExpress(app);
import { initRoutes } from './routes';
initRoutes(app);

server.listen(config.port, config.ip, () => {
  console.log(`Server is listening on http://${config.ip}:${config.port}, in ${app.get('env')} mode`);
});

function writeConfigFile() {
  const content = `
{
  "resource": "${config.KEYCLOAK_CLIENT}",
  "realm": "${config.KEYCLOAK_REALM}",
  "auth-server-url": "${config.KEYCLOAK_URL}",
  "bearer-only": true,
  "credentials": {
    "secret": "${config.KEYCLOAK_SECRET}"
  }
}
`
  writeFileSync('keycloak.json', content)
}