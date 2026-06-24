"use client";

import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

interface FormCheckboxProps<T extends FieldValues> {
  control: Control<T>;
}

const FormCheckbox = <T extends FieldValues>({ control }: FormCheckboxProps<T>) => {
  return (
    <Controller
      name={"terms" as Path<T>}
      control={control}
      rules={{ required: "You must agree to the terms" }}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={field.value || false}
              onCheckedChange={field.onChange}
              className="border-white cursor-pointer"
            />

            <label
              htmlFor="terms"
              className="text-sm text-white leading-tight cursor-pointer"
            >
              I agree to the{" "}
              <a href="#" className="text-emerald-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/terms-condition" className="text-emerald-600 hover:underline">
               Terms & Condition
              </a>
            </label>
          </div>

          {fieldState.error && (
            <p className="text-red-500 text-sm">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
};

export default FormCheckbox;
