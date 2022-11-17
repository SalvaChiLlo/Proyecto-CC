import { Router } from 'express'
import login from '../service/authService';

const authRoutes = Router();

authRoutes.get('/:user/:password', login);

export default authRoutes;