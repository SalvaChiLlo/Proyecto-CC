import { Router } from 'express'
import checkServerStatus from '../service/statusService';

const statusRoutes = Router();

statusRoutes.get('/', checkServerStatus);

export default statusRoutes;