import { Router } from 'express'
import { addJob, checkJobStatus } from '../service/jobService';

const jobRoutes = Router();

jobRoutes.get('/status/:id', checkJobStatus);
jobRoutes.post('/addJob', addJob);

export default jobRoutes;