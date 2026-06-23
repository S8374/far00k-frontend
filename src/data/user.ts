type UserRole = "buyer" | "agent";
type User = {
  role: UserRole;
};

export const user: User = {
  role: "agent"
}