import { useState } from "react";
import Boton from "../atomos/Boton";

export type FormField = {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
};

type Props<T extends Record<string, any>> = {
  fields: FormField[];
  onSubmit: (values: T) => void;
  buttonText: string;
  initialValues?: Partial<T>;
  className?: string;
};

const Form = <T extends Record<string, any>>({ fields, onSubmit, buttonText = "Enviar", initialValues = {}, className = "" }: Props<T>) => {
  const [formData, setFormData] = useState<Partial<T>>(initialValues);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData); // Verifica los datos aquí
    onSubmit(formData as T);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-4 p-4 border rounded-lg shadow-md ${className}`}>
      {fields.map((field) => (
        <div key={field.key} className="flex flex-col">
          <label className="font-semibold">{field.label}</label>
          {field.type === "select" ? (
            <select
              required={field.required}
              value={formData[field.key] || ""}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(field.key, e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Seleccione...</option>
              {field.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              required={field.required}
              value={formData[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="border p-2 rounded"
            />
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