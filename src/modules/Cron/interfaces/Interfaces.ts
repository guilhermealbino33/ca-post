interface IBatchBody {
  id: string;
  method: string;
  url: string;
  headers?: object;
  body?: object;
}

export { IBatchBody };
