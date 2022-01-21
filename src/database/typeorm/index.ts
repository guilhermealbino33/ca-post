import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (host = "api_test"): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      host,
    })
  );
};
