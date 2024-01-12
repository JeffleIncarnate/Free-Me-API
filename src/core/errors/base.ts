export type JSONObject =
  | string
  | number
  | boolean
  | { [x: string]: JSONObject }
  | Array<JSONObject>;

export class HTTPError {
  public status: number;
  public message: JSONObject;

  constructor(status: number, details: JSONObject) {
    const message = {
      success: false,
      details,
      status,
    };

    this.message = message;
    this.status = status;
  }
}
