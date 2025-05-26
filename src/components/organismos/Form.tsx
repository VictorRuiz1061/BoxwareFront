import { useState } from "react";
import Boton from "../atomos/Boton";
import { ZodSchema } from "zod";
import { useTheme } from "../../context/ThemeContext";

export type FormField = {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  options?: Array<string | { value: string | number; label: string }>;
};

type Props<T extends Record<string, any>> = {
  fields: FormField[];
  onSubmit: (values: T) => void;
  buttonText: string;
  initialValues?: Partial<T>;
  className?: string;
  schema?: ZodSchema<any>;
};

const Form = <T extends Record<string, any>>({ fields, onSubmit, buttonText = "Enviar", initialValues = {}, className = "", schema }: Props<T>) => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState<Partial<T>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started with data:', formData);
    
    if (schema) {
      console.log('Validating with schema:', schema);
      const parsed = schema.safeParse(formData);
      if (!parsed.success) {
        console.error('Schema validation failed:', parsed.error);
        const fieldErrors: Record<string, string> = {};
        parsed.error.errors.forEach(err => {
          if (err.path && err.path[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        console.log('Field errors:', fieldErrors);
        setErrors(fieldErrors);
        return;
      }
      console.log('Schema validation passed');
    }
    
    console.log('Calling onSubmit with data:', formData);
    onSubmit(formData as T);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-4 p-4 border rounded-lg shadow-md ${darkMode ? 'bg-gradient-to-b from-slate-900 to-slate-800 text-white border-slate-700' : 'bg-white text-gray-800 border-gray-300'} ${className}`}>
      {fields.map((field) => (
        <div key={field.key} className="flex flex-col">
          <label className={`font-semibold ${darkMode ? 'text-emerald-300' : 'text-gray-700'}`}>{field.label}</label>
          {field.type === "select" ? (
            <select
              required={field.required}
              value={formData[field.key] || ""}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(field.key, e.target.value)}
              className={`border p-2 rounded ${darkMode ? 'bg-slate-800 text-white border-slate-700 focus:border-emerald-400 focus:outline-none' : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500'}`}
            >
              <option key="default-option" value="">Seleccione...</option>
              {field.options?.map((option, idx) => {
                if (typeof option === 'string') {
                  return (
                    <option key={`str-${option}-${idx}`} value={option}>
                      {option}
                    </option>
                  );
                } else {
                  return (
                    <option key={`obj-${option.value}`} value={option.value}>
                      {option.label}
                    </option>
                  );
                }
              })}
            </select>
          ) : (
            <input
              type={field.type}
              required={field.required}
              value={formData[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className={`border p-2 rounded ${darkMode ? 'bg-slate-800 text-white border-slate-700 focus:border-emerald-400 focus:outline-none' : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500'}`}
            />
          )}
          {errors[field.key] && (
            <span className={`${darkMode ? 'text-red-300' : 'text-red-600'} text-xs mt-1`}>{errors[field.key]}</span>
          )}
        </div>
      ))}
      <Boton color="primary" variant="shadow" type="submit">
        {buttonText}
      </Boton>
    </form>
  );
};

export default Form;
