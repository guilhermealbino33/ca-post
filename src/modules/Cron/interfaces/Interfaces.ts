interface IBatchBody {
  id: string;
  method: string;
  url: string;
  headers?: object;
  body?: object;
}
interface IAttribute {
  Name: string;
  Value: string;
}

export { IBatchBody, IAttribute };
