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
  conditional?: (values: Record<string, any>) => boolean;
  description?: string; // Para mostrar una descripción adicional del campo
};

type Props<T extends Record<string, any>> = {
  fields: FormField[];
  onSubmit: (values: T) => void;
  buttonText: string;
  initialValues?: Partial<T>;
  className?: string;
  schema?: ZodSchema<any>;
  onChange?: (key: string, value: string | boolean) => void;
};

const Form = <T extends Record<string, any>>({ fields, onSubmit, buttonText = "Enviar", initialValues = {}, className = "", schema, onChange }: Props<T>) => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState<Partial<T>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
    
    // Si hay un manejador de cambio externo, lo llamamos
    if (onChange) {
      onChange(key, value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (schema) {
      const parsed = schema.safeParse(formData);
      if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        parsed.error.errors.forEach(err => {
          if (err.path && err.path[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }
    }
    
    onSubmit(formData as T);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-4 p-4 border rounded-lg shadow-md ${darkMode ? 'bg-gradient-to-b from-slate-900 to-slate-800 text-white border-slate-700' : 'bg-white text-gray-800 border-gray-300'} ${className}`}>
      {fields.map((field) => {
        // Si el campo tiene una condición y no se cumple, no lo mostramos
        if (field.conditional && !field.conditional(formData as Record<string, any>)) {
          return null;
        }
        
        return (
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
          ) : field.type === "toggle" ? (
            <div className="flex items-center mt-1">
              <div 
                className={`relative inline-block w-12 h-6 rounded-full cursor-pointer ${formData[field.key] ? (darkMode ? 'bg-emerald-500' : 'bg-blue-500') : (darkMode ? 'bg-slate-600' : 'bg-gray-300')}`}
                onClick={() => handleChange(field.key, !formData[field.key])}
              >
                <span 
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${formData[field.key] ? 'transform translate-x-6' : ''}`}
                ></span>
              </div>
              <span className="ml-3 text-sm">{formData[field.key] ? 'Sí' : 'No'}</span>
              {field.description && (
                <span className={`ml-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {field.description}
                </span>
              )}
            </div>
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
        );
      })}
      <Boton color="primary" variant="shadow" type="submit">
        {buttonText}
      </Boton>
    </form>
  );
};

export default Form;
