import { Router } from 'express'
import checkServerStatus, { getLoad } from '../service/statusService';
import { Keycloak } from 'keycloak-connect';
import { getKeycloak } from '../utils/keycloakConfig';

const statusRoutes = Router();
const keycloak: Keycloak = getKeycloak();

statusRoutes.get('/', checkServerStatus);
statusRoutes.get('/load', keycloak.protect(), getLoad);

export default statusRoutes;