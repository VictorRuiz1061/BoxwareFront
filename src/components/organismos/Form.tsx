import { useState } from "react";
import Boton from "../atomos/Boton";

export type FormField = {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[]; // Add options property for select fields
};

type Props = {
  fields: FormField[];
  onSubmit: (values: Record<string, string>) => void;
  buttonText: string;
  initialValues?: Record<string, string | number | undefined>; // Add initialValues prop
};

const Form: React.FC<Props> = ({ fields, onSubmit, buttonText = "Enviar" }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData); // Verifica los datos aquí
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded-lg shadow-md">
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