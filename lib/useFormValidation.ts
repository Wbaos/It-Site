"use client";
import { useState } from "react";

type UseFormValidationOptions<T> = {
    requiredKeys?: (keyof T)[];
};

export function useFormValidation<T extends Record<string, string>>(
    initialValues: T,
    options: UseFormValidationOptions<T> = {}
) {
    const [values, setValues] = useState<T>(initialValues);

    const [errors, setErrors] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);

    const handleChange = (name: keyof T, value: string) => {
        setValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: false }));
    };

    const validateRequired = () => {
        const newErrors = {} as Record<keyof T, boolean>;
        const requiredKeys = options.requiredKeys ?? (Object.keys(values) as (keyof T)[]);

        for (const key of requiredKeys) {
            if (!values[key]?.trim()) {
                newErrors[key] = true;
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getInputClass = (name: keyof T) =>
        `input ${errors[name] ? "input-error" : ""}`;

    return { values, setValues, errors, handleChange, validateRequired, getInputClass };
}
