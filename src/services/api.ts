import axios from "axios";
import qs from "qs";

const api = axios.create({
  baseURL: "https://api.channeladvisor.com",
});

export const createToken = async () => {
  const config = qs.stringify({
    grant_type: process.env.GRANT_TYPE,
    refresh_token: process.env.REFRESH_TOKEN,
  });
  const headers = {
    Authorization: `Basic ${process.env.AUTHORIZATION}`,
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "*/*",
  };
  return api
    .post("/oauth2/token", config, { headers })
    .then(async (response) => {
      api.defaults.headers.common.Authorization = `Bearer ${response.data.access_token}`;
      console.log("refresh token");
      return response.data;
    });
};

api.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      console.log("entrou");
      originalRequest._retry = true;
      const config = qs.stringify({
        grant_type: process.env.GRANT_TYPE,
        refresh_token: process.env.REFRESH_TOKEN,
      });
      const headers = {
        Authorization: `Basic ${process.env.AUTHORIZATION}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "*/*",
      };
      return api
        .post("/oauth2/token", config, { headers })
        .then(async (response) => {
          api.defaults.headers.common.Authorization = `Bearer ${response.data.access_token}`;
          console.log("retrying refresh token");
          return api(originalRequest);
        })
        .catch((err) => {
          error.status(401).json(err);
        });
    }
    return Promise.reject(error);
  }
);

export default api;
