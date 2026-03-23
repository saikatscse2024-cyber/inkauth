import { createClient } from "@libsql/client/web";

export const tursoClient = () => {
  let url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.warn("Turso credentials missing");
    return null;
  }

  // @libsql/client/web requires https:// not libsql:// — convert automatically
  if (url.startsWith("libsql://")) {
    url = url.replace("libsql://", "https://");
  }

  return createClient({ url, authToken });
};
