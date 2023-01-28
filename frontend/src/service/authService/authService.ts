import axios, { AxiosError, AxiosResponse } from 'axios';
import {readFileSync} from 'fs'
import qs from "qs";

export async function login(user: string, password: string): Promise<any> {
  let message: any;
  try {
    const response = await getToken(user, password);
    message = response.data?.access_token;
  } catch (err: any) {
    const axiosError: AxiosError = err;
    // const data: any = axiosError.response.data;
    // message = data.error_description;
    message = axiosError;
  }
  return message;
}

function getToken(user: string, password: string): Promise<AxiosResponse> {
  const kcconfig = JSON.parse(readFileSync("keycloak.json").toString())
  
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
  console.log(config);

  return axios(config);
}