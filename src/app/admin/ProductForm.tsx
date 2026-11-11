"use client";

import { useActionState, useEffect, useRef } from "react";
import { createProductAction } from "@/app/actions";
import { Alert, Field, SubmitButton } from "@/components/ui";
import { useKeepValuesSubmit } from "@/components/useKeepValuesSubmit";

export function ProductForm({ categories }: { categories: string[] }) {
  const [state, formAction, pending] = useActionState(createProductAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const onSubmit = useKeepValuesSubmit(formAction);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} onSubmit={onSubmit}className="h-fit space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold">Nuevo producto</h2>
      <Field label="Nombre" name="name" required maxLength={120} placeholder='Tablet 11" 128 GB' />

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Descripción</span>
        <textarea
          name="description"
          rows={3}
          placeholder="Características principales…"
          className="block w-full rounded-xl border border-slate-300 px-3.5 py-3 text-base outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Precio (S/)" name="price" required inputMode="decimal" placeholder="1299.90" />
        <Field label="Stock" name="stock" type="number" required min={0} step={1} defaultValue={10} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Categoría</span>
          <select
            name="category"
            className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base outline-none focus:border-indigo-500"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <Field label="…o una nueva" name="newCategory" placeholder="Tablets" />
      </div>

      <Field
        label="URL de imagen (opcional)"
        name="imageUrl"
        type="url"
        placeholder="https://…"
        hint="Si la dejas vacía se muestra una ilustración según la categoría."
      />

      {state?.error && <Alert kind="error">{state.error}</Alert>}
      {state?.ok && <Alert kind="ok">{state.ok}</Alert>}
      <SubmitButton pending={pending}>Guardar producto</SubmitButton>
    </form>
  );
}
