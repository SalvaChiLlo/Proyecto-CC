// import Endpoints
import { Express } from "express";
import jobRoutes from "./controller/jobController";
import statusRoutes from "./controller/statusController";

export function initRoutes(app: Express) {

  app.use('/health', statusRoutes)
  app.use('/api', jobRoutes)

};
