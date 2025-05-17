import { Cookie } from "../constants";

export function logoutChefUser(ctx) {
  ctx.deleteCookie(Cookie.SessionId);
}
