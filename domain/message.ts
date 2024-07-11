export type DomainMessage = {
  id: string;
  body: string;
  userId: string | null;
  avatarUrl: string | null;
  fullName: string | null;
};
