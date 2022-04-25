/* eslint-disable no-return-await */
/* eslint-disable func-names */
import axios, { AxiosResponse } from "axios";

interface ITokenResponse {
  access_token: string;
  expires_in: string;
  token_type: string;
  scope: string;
}

const api = axios.create({
  baseURL: "https://api.lightspeedapp.com",
});

export const getToken = async (): Promise<string> => {
  const config = {
    client_id: process.env.LS_CLIENT_ID,
    client_secret: process.env.LS_CLIENT_SECRET,
    grant_type: process.env.LS_GRANT_TYPE,
    refresh_token: process.env.LS_REFRESH_TOKEN,
  };

  return api
    .post("/oauth/access_token.php", config)
    .then(function (response: AxiosResponse<ITokenResponse>) {
      return response.data.access_token;
    })
    .catch(function (response) {
      console.log("Failed to get LightSpeed token!", response);
      return "";
    });
};

export default api;
