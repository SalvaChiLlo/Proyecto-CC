import { Router } from 'express'
import { getFile } from '../service/fileService/fileService';
import { addJob, checkJobStatus, deleteJob, showUserJobs } from '../service/jobService/jobService';
import { getKeycloak } from '../utils/keycloak/keycloakConfig';
import { Keycloak } from 'keycloak-connect';
import { lookup } from 'mime-types';

const jobRoutes = Router();
const keycloak: Keycloak = getKeycloak();

jobRoutes.post('/addJob', keycloak.protect(), async (req, res) => {
  const url = req.body.url;
  const args = req.body.args;
  const jobConfig = req.body.config;
  const token = req.headers.authorization;
  const result = await addJob(url, args, jobConfig, token);
  res.send(result)
});

jobRoutes.get('/status/:id', keycloak.protect(), async (req, res) => {

  const jobId = req.params.id;
  const token = req.headers.authorization;

  let message: any = await checkJobStatus(jobId, token);

  res.send(message)
});

jobRoutes.get('/status', keycloak.protect(), async (req, res) => {
  const token = req.headers.authorization.replace('Bearer ', '')
  res.send(await showUserJobs(token));
});

jobRoutes.get('/results/:id/:file', keycloak.protect(), async (req, res) => {
  const jobId = req.params.id;
  const file = req.params.file;

  try {
    res.set('Content-disposition', 'attachment; filename=' + file);
    res.set('Content-Type', lookup(file)?.toString());
    res.send(await getFile(jobId + '/' + file))

  } catch (err: any) {
    console.log(err);

    res.status(404)
    res.send(err.message)
  }
});

jobRoutes.get('/deleteJob/:id', keycloak.protect(), async (req, res) => {
  const jobId = req.params.id;
  const token = req.headers.authorization;
  let message: any = await deleteJob(jobId, token);
  res.send(message)
});

export default jobRoutes;