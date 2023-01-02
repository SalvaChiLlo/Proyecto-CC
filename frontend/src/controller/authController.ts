import { Router } from 'express'
import { login } from '../service/authService/authService';

const authRoutes = Router();

authRoutes.get('/:user/:password', async (req, res) => {
  const user = req.params.user;
  const password = req.params.password;
  let message = await login(user, password);

  res.send(message)
});

export default authRoutes;