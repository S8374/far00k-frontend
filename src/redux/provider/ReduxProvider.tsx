"use client";

import { Provider } from "react-redux";
import { makeStore } from "@/redux/store";
import { useMemo } from "react";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = useMemo(() => makeStore(), []);

  return <Provider store={store}>{children}</Provider>;
}
