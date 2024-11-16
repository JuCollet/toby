import { BaseClass } from "../baseClass";

export class GoogleAuthClient extends BaseClass {
  constructor(fetchFn: typeof fetch) {
    super(fetchFn, "");
  }

  logOut = async (token: string): Promise<unknown> => {
    return this.request(`https://oauth2.googleapis.com/revoke?token=${token}`, {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
    });
  };
}
