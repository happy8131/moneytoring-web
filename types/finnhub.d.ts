declare module 'finnhub' {
  export class DefaultApi {
    marketNews(
      category: string,
      options: any,
      callback: (error: any, data: any) => void
    ): void;
    companyNews(
      symbol: string,
      from: string,
      to: string,
      options: any,
      callback: (error: any, data: any) => void
    ): void;
  }

  export class ApiClient {
    static instance: ApiClient;
    authentications: Record<string, any>;
  }

  export default {
    ApiClient,
    DefaultApi,
  };
}
