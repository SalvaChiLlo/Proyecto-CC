import session, { MemoryStore } from 'express-session';
import { Express } from 'express';
import KeyCloak from 'keycloak-connect';

let keycloak: KeyCloak.Keycloak;

export function initKeycloak(app: Express): KeyCloak.Keycloak {
  if (keycloak) {
    return keycloak;
  }
  const memoryStore: MemoryStore = new session.MemoryStore();
  app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  }));
  keycloak = new KeyCloak({ store: memoryStore });

  app.use(keycloak.middleware({
    admin: '/',
    logout: '/logout',
  }));

  return keycloak;
}

export function getKeycloak(): KeyCloak.Keycloak {
  if (!keycloak || keycloak === undefined) {
    throw new Error('There is no app initialized');
  }
  return keycloak;
}
