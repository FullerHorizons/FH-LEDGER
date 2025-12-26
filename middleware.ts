export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/command-center",
    "/brain-dump",
    "/calendar",
    "/contacts",
    "/stops",
    "/projects",
    "/ledger",
    "/invoice-create",
  ],
};
