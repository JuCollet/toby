export class BaseClass {
  protected fetchFn: typeof fetch;
  protected baseUrl: string;

  constructor(fetchFn: typeof fetch, baseUrl: string) {
    this.fetchFn = fetchFn;
    this.baseUrl = baseUrl;
  }

  protected async request(
    endpoint: string,
    options?: RequestInit,
  ): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.fetchFn(url, options);
  }
}
