import { Cookie } from "../constants";

export function logoutChefUser(ctx: any) {
  ctx.deleteCookie(Cookie.SessionId);
}
