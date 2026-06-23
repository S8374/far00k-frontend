import { ReactNode } from "react";
import PublicRoute from "@/routes/PublicRoute";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <PublicRoute>{children}</PublicRoute>;
};

export default AuthLayout;