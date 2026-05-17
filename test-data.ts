export type Credentials = {
  email: string;
  password: string;
  role?: string;
};

export const validUser: Credentials = {
  email: "user@example.com",
  password: "P@ssw0rd",
  role: "admin",
};

export function getLoginUrl(env: string): string {
  return `https://${env}.example.com/login`;
}
