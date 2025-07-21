import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Toggle, IconButton } from "@/components/atomos";

export type FormField = {
  key: string;
  label: string;
  type: 'text' | 'password' | 'email' | 'number' | 'select' | 'date' | 'file' | 'toggle';
  required?: boolean;
  options?: { label: string; value: string | number }[];
  extraButton?: {
    icon: React.ReactNode;
    onClick: () => void;
    className?: string;
    color?: string;
    size?: "sm" | "md" | "lg" | number;
    title?: string;
    disabled?: boolean;
  };
  conditional?: (values: Record<string, any>) => boolean;
  description?: string;
  className?: string;
  onChange?: (value: any) => void;
  multiple?: boolean;
  // Configuraciones específicas del Input
  inputConfig?: {
    size?: "sm" | "md" | "lg";
    variant?: "default" | "bordered" | "underlined" | "filled";
    color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
    radius?: "none" | "sm" | "md" | "lg" | "full";
    fullWidth?: boolean;
    leftContent?: React.ReactNode;
    rightContent?: React.ReactNode;
    isInvalid?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isClearable?: boolean;
    onClear?: () => void;
    className?: string;
    labelClassName?: string;
    inputClassName?: string;
    descriptionClassName?: string;
    errorClassName?: string;
  };
};

interface FormProps {
  fields: FormField[];
  onSubmit: (values: Record<string, any>) => void;
  buttonText?: string;
  initialValues?: Record<string, any>;
  schema?: any;
  disabled?: boolean;
  // Configuración global del Input para todos los campos
  defaultInputConfig?: {
    size?: "sm" | "md" | "lg";
    variant?: "default" | "bordered" | "underlined" | "filled";
    color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
    radius?: "none" | "sm" | "md" | "lg" | "full";
    fullWidth?: boolean;
    leftContent?: React.ReactNode;
    rightContent?: React.ReactNode;
    isInvalid?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isClearable?: boolean;
    onClear?: () => void;
    className?: string;
    labelClassName?: string;
    inputClassName?: string;
    descriptionClassName?: string;
    errorClassName?: string;
  };
}

const Form = ({ 
  fields, 
  onSubmit, 
  buttonText = "Enviar", 
  initialValues = {}, 
  schema, 
  disabled = false,
  defaultInputConfig = {}
}: FormProps) => {
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

          // Combinar configuración global con configuración específica del campo
          const inputConfig = {
            ...defaultInputConfig,
            ...field.inputConfig,
            // Asegurar que el error se aplique si hay errores de validación
            isInvalid: field.inputConfig?.isInvalid || !!errors[field.key],
            errorMessage: errors[field.key]?.message as string,
            // Asegurar que el label se muestre
            label: field.label,
            // Asegurar que la descripción se muestre
            description: field.description,
            // Asegurar que el required se aplique
            isRequired: field.required
          };

          return (
            <div key={field.key} className={`space-y-2 ${field.className || 'col-span-2'}`}>
              {field.type === "select" ? (
                <>
                  <div className="flex items-center justify-between">
                    <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.extraButton && (
                      <IconButton
                        icon={field.extraButton.icon}
                        onClick={field.extraButton.onClick}
                      />
                    )}
                  </div>

                  {field.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{field.description}</p>
                  )}

                  <select
                    {...registerProps}
                    ref={ref}
                    multiple={field.multiple}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    onChange={(e) => {
                      if (field.multiple) {
                        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                        setValue(field.key, selectedOptions);
                      } else {
                        registerProps.onChange(e);
                      }
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

                  {errors[field.key] && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors[field.key]?.message as string}
                    </p>
                  )}
                </>
              ) : field.type === "toggle" ? (
                <>
                  <div className="flex items-center justify-between">
                    <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.extraButton && (
                      <IconButton
                        icon={field.extraButton.icon}
                        onClick={field.extraButton.onClick}
                      />
                    )}
                  </div>

                  {field.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{field.description}</p>
                  )}

                  <div className="mt-1">
                    <Toggle
                      isOn={watchAllFields[field.key] === true || watchAllFields[field.key] === 'true'}
                      onToggle={(e) => {
                        // Prevenir que el evento se propague y cause behaviors no deseados
                        if (e && e.preventDefault) {
                          e.preventDefault();
                        }
                        if (e && e.stopPropagation) {
                          e.stopPropagation();
                        }
                        
                        const newValue = !(watchAllFields[field.key] === true || watchAllFields[field.key] === 'true');
                        setValue(field.key, newValue);
                        
                        // Ejecutar onChange personalizado si existe
                        if (field.onChange) {
                          field.onChange(newValue);
                        }
                      }}
                    />
                  </div>

                  {errors[field.key] && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors[field.key]?.message as string}
                    </p>
                  )}
                </>
              ) : (
                <Input
                  type={field.type}
                  {...registerProps}
                  ref={ref}
                  {...inputConfig}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={disabled}
          className={`px-4 py-2 rounded-md transition-colors ${
            disabled 
              ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
};

export default Form;
