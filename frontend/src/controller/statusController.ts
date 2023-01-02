import { Router } from 'express'
import { checkServerStatus, getLoad } from '../service/statusService/statusService';
import { Keycloak } from 'keycloak-connect';
import { getKeycloak } from '../utils/keycloak/keycloakConfig';

const statusRoutes = Router();
const keycloak: Keycloak = getKeycloak();

statusRoutes.get('/', (req, res) => {
  res.send(checkServerStatus());
});

statusRoutes.get('/load', keycloak.protect(), (req, res) => {
  res.send(getLoad())
});

export default statusRoutes;