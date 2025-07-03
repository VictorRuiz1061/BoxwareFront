import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/atomos";

export type FormField = {
  key: string;
  label: string;
  type: 'text' | 'password' | 'email' | 'number' | 'select' | 'date' | 'file' | 'toggle';
  required?: boolean;
  options?: { label: string; value: string | number }[];
  extraButton?: {
    icon: string;
    onClick: () => void;
    className?: string;
  };
  conditional?: (values: Record<string, any>) => boolean;
  description?: string; // Para mostrar una descripción adicional del campo
};

interface FormProps {
  fields: FormField[];
  onSubmit: (values: Record<string, string>) => void;
  buttonText?: string;
  initialValues?: Record<string, string>;
  schema?: any;
}

const Form = ({ fields, onSubmit, buttonText = "Enviar", initialValues = {}, schema }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: initialValues,
  });

  const watchAllFields = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field) => {
        // Si el campo tiene una condición y no se cumple, no lo mostramos
        if (field.conditional && !field.conditional(watchAllFields)) {
          return null;
        }

        const { ref, ...registerProps } = register(field.key);

        return (
          <div key={field.key} className="space-y-2">
            <div className="flex items-center">
              <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.extraButton && (
                <button
                  type="button"
                  onClick={field.extraButton.onClick}
                  className={field.extraButton.className}
                >
                  {field.extraButton.icon}
                </button>
              )}
            </div>

            {field.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{field.description}</p>
            )}

            {field.type === "select" ? (
              <select
                {...registerProps}
                ref={ref}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Seleccione una opción</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "toggle" ? (
              <Input
                type="checkbox"
                {...registerProps}
                ref={ref}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            ) : (
              <Input
                type={field.type}
                {...registerProps}
                ref={ref}
                className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            )}

            {errors[field.key] && (
              <p className="mt-2 text-sm text-red-600">
                {errors[field.key]?.message as string}
              </p>
            )}
          </div>
        );
      })}

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
};

export default Form;
