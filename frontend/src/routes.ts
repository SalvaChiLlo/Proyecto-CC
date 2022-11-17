// import Endpoints
import { Express } from "express";
import authRoutes from "./controller/authController";
import jobRoutes from "./controller/jobController";
import statusRoutes from "./controller/statusController";

export function initRoutes(app: Express) {

  app.use('/health', statusRoutes)
  app.use('/api', jobRoutes)
  app.use('/auth', authRoutes)

};
