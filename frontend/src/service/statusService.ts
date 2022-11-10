import { Request, Response } from "express";

export default function checkServerStatus(req: Request, res: Response) {
  res.status(200).send('<h1>Server is running</h1>');
}