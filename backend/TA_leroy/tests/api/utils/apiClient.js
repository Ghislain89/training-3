export class ApiClient {
  constructor(request, baseURL) {
    this.request = request;
    this.baseURL = baseURL;
  }

  get(path) {
    return this.request.get(`${this.baseURL}${path}`);
  }

  post(path, data) {
    return this.request.post(`${this.baseURL}${path}`, { data });
  }

  put(path, data) {
    return this.request.put(`${this.baseURL}${path}`, { data });
  }

  delete(path) {
    return this.request.delete(`${this.baseURL}${path}`);
  }
}

































