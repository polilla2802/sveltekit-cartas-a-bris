declare module "@authjs/core" {
  export interface AuthOptions {
    providers: Provider[];
    adapter: any;
    secret: string;
    session?: {
      jwt: boolean;
    };
  }

  export interface Provider {
    id: string;
    name: string;
    type: string;
    credentials?: any;
    authorization?: {
      url: string;
      params?: any;
    };
  }

  export class Auth {
    constructor(options: AuthOptions);
  }
}
