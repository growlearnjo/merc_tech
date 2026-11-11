"use client";

import { startTransition } from "react";

/**
 * React 19 limpia los formularios tras cada `action`. Enviando así, los datos
 * escritos se conservan cuando la acción devuelve un error.
 */
export function useKeepValuesSubmit(dispatch: (fd: FormData) => void) {
  return (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
}
