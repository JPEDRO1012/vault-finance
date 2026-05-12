import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "vault-finance-secret"
);

export async function getAuthenticatedUserId() {
  const cookieStore = await cookies();

  const token = cookieStore.get("vault-token")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    return payload.sub as string;
  } catch {
    return null;
  }
}