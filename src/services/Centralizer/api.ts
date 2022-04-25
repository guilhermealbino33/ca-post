/* eslint-disable no-return-await */
/* eslint-disable func-names */
import axios, { AxiosResponse } from "axios";

interface ITokenResponse {
  accessToken: string;
  refreshToken: string;
}
const apiCentralizer = axios.create({
  baseURL: "https://hml-api.incycle.com/api",
});

export const getAuthToken = async (): Promise<string> => {
  const config = {
    email: "a@a.com",
    password: "Master#123",
  };

  return apiCentralizer
    .post("/sessions", config)
    .then(function (response: AxiosResponse<ITokenResponse>) {
      return response.data.accessToken;
    })
    .catch(function (response) {
      console.log("Failed to get token!", response);
      return "";
    });
};

export default apiCentralizer;
