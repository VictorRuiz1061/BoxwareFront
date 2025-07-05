import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Toggle } from "@/components/atomos";

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
  description?: string;
  className?: string;
  onChange?: (value: string) => void;
  multiple?: boolean;
};

interface FormProps {
  fields: FormField[];
  onSubmit: (values: Record<string, any>) => void;
  buttonText?: string;
  initialValues?: Record<string, any>;
  schema?: any;
}

const Form = ({ fields, onSubmit, buttonText = "Enviar", initialValues = {}, schema }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: initialValues,
  });

  const watchAllFields = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {fields.map((field) => {
          if (field.conditional && !field.conditional(watchAllFields)) {
            return null;
          }

          const { ref, ...registerProps } = register(field.key);

          return (
            <div key={field.key} className={`space-y-2 ${field.className || 'col-span-2'}`}>
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
                  multiple={field.multiple}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  onChange={(e) => {
                    if (field.multiple) {
                      const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                      setValue(field.key, selectedOptions, { shouldValidate: true });
                    } else {
                      registerProps.onChange(e);
                    }
                    field.onChange?.(e.target.value);
                  }}
                  size={field.multiple ? Math.min(field.options?.length || 4, 6) : undefined}
                >
                  {!field.multiple && <option value="">Seleccione una opción</option>}
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "toggle" ? (
                <div className="mt-1">
                  <Toggle
                    isOn={watchAllFields[field.key] === true || watchAllFields[field.key] === 'true'}
                    onToggle={() => {
                      const newValue = !(watchAllFields[field.key] === true || watchAllFields[field.key] === 'true');
                      setValue(field.key, newValue, { shouldValidate: true });
                      field.onChange?.(String(newValue));
                    }}
                  />
                </div>
              ) : field.type === "date" ? (
                <Input
                  type="date"
                  {...registerProps}
                  ref={ref}
                  className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
};

export default Form;