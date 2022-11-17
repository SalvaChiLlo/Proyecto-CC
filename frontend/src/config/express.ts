import cors from 'cors';
import express, { Express } from 'express';
import compression from 'compression';
import methodOverride from 'method-override';
import { initKeycloak } from '../utils/keycloakConfig';

export function configExpress(app: Express) {
  app.use(compression());
  app.use(express.urlencoded({ extended: false, limit: '50mb' }));
  app.use(express.json({ limit: '50mb' }));
  app.use(methodOverride());
  app.use(cors({}));

  const keycloak = initKeycloak(app);
  app.use(keycloak.middleware({
    admin: '/admin',
    logout: '/logout',
  }));
};
