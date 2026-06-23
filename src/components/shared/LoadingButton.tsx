"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Check, CircleCheckBig, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  isSuccess?: boolean;
  children: React.ReactNode;
}

export function LoadingButton({
  isLoading,
  isSuccess,
  children,
  className,
  ...props
}: LoadingButtonProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);

      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return (
    <Button
      disabled={isLoading}
      className={cn("w-full h-12 text-base relative cursor-pointer", className)}
      {...props}
    >
      {isLoading ? (
        <Loader size={40} className="animate-spin" />
      ) : showSuccess ? (
        <CircleCheckBig size={40} className=" text-white" />
      ) : (
        children
      )}
    </Button>
  );
}