export type UserRole = "VISITOR" | "PLAYER" | "OWNER";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  gameSlug?: string;
  inGameName?: string;
  teamRole?: string;
  createdAt: string;
};

export type SessionPayload = {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
  expiresAt: number;
};
