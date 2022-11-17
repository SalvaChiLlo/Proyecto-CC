import { Request, Response } from "express";
import axios from 'axios';
import qs from "qs";
import kcconfig from '../../keycloak.json'

export default async function login(req: Request, res: Response) {
  const response = await getToken(req.params.user, req.params.password);
  res.send(response.data.access_token);
}

async function getToken(user: string, password: string) {
  const data = qs.stringify({
    grant_type: 'password',
    client_id: kcconfig.resource,
    client_secret: kcconfig.credentials.secret,
    username: user,
    password,
  });

  const config = {
    method: 'post',
    url: `${kcconfig['auth-server-url']}realms/${kcconfig.realm}/protocol/openid-connect/token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // Cookie: 'AUTH_SESSION_ID_LEGACY=5f1bb1c5-f7e7-4878-a861-9edbadd6f16a',
    },
    data,
  };

  return axios(config);
}