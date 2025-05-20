import { Cookie } from "@feast/shared";

export function logoutChefUser(ctx: any) {
  ctx.deleteCookie(Cookie.SessionId);
}
