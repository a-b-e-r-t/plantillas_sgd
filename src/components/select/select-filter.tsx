'use client';

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectProps } from "@radix-ui/react-select";

// Define las props del componente, incluyendo las props de select
export interface GenericSelectProps extends SelectProps {
  options: Array<{ value: string; label: string }>;
  onChange?: (value: string | null) => void;
  placeholder: string;
}

// Usa forwardRef para permitir que se le pasen refs
export const SelectFilter = React.forwardRef<HTMLButtonElement, GenericSelectProps>(
  ({ options, placeholder, onChange, value, ...props }, ref) => {
    return (
      <Select {...props} onValueChange={onChange} value={value} >
        <SelectTrigger ref={ref} className="border-border"> {/* Asigna la ref aquí */}
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{placeholder}</SelectLabel>
            {options.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
);

SelectFilter.displayName = "SelectFilter"; // Asignamos un nombre al componente para depuración