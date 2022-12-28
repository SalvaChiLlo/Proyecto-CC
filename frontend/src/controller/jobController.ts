import { Router } from 'express'
import getFile from '../service/fileService';
import { addJob, checkJobStatus, deleteJob, showUserJobs } from '../service/jobService';
import { getKeycloak } from '../utils/keycloakConfig';
import { Keycloak } from 'keycloak-connect';

const jobRoutes = Router();
const keycloak: Keycloak = getKeycloak();

jobRoutes.post('/addJob', keycloak.protect(), addJob);
jobRoutes.get('/status/:id', keycloak.protect(), checkJobStatus);
jobRoutes.get('/status', keycloak.protect(), showUserJobs);
jobRoutes.get('/results/:id/:file', keycloak.protect(), getFile);

jobRoutes.get('/deleteJob/:id', keycloak.protect(), deleteJob);

export default jobRoutes;