import {jwtDecode} from "jwt-decode";

export type JwtPayload = {
  sub: string;
  userId: string;
  role: string;
  exp: number;
};

export function getJwtPayload(): JwtPayload | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = jwtDecode<JwtPayload>(token);

    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }

    return payload;
  } catch {
    localStorage.removeItem("token");
    return null;
  }
}