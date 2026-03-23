import { createClient } from "@libsql/client";

export const tursoClient = () => {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.warn("Turso credentials missing");
    return null;
  }

  return createClient({
    url,
    authToken,
  });
};
