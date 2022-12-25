import { Request, Response } from "express";
import axios, { AxiosError, AxiosResponse } from 'axios';
import qs from "qs";
import kcconfig from '../../keycloak.json'


export default async function login(req: Request, res: Response) {
  let message;
  try {
    const response = await getToken(req.params.user, req.params.password);
    message = response.data?.access_token;
  } catch (err: any) {
    const axiosError: AxiosError = err;
    // const data: any = axiosError.response.data;
    // message = data.error_description;
    message = axiosError
  }

  res.send(message)
}

function getToken(user: string, password: string): Promise<AxiosResponse> {
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