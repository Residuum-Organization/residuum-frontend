import React from "react";
import { Loader2 } from "lucide-react";
import Button from "./Button";

export default function LoadingButton({
  isLoading = false,
  loadingText = "Carregando...",
  disabled = false,
  children,
  ...props
}) {
  return (
    <Button disabled={disabled || isLoading} {...props}>
      <span className="inline-flex items-center justify-center gap-2">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : null}
        {isLoading ? loadingText : children}
      </span>
    </Button>
  );
}
