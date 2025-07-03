import { useState } from "react";
import { usePostUsuario } from "@/hooks/usuario";
import { useGetRoles } from "@/hooks/roles";
import { Form } from "@/components/organismos";
import type { FormField } from "@/components/organismos";
import { usuarioSchema } from "@/schemas";
import { showSuccessToast, showErrorToast } from "@/components/atomos";

interface UsuarioFormProps {
  onUsuarioCreated?: () => void;
}

const UsuarioForm = ({ onUsuarioCreated }: UsuarioFormProps) => {
  const { crearUsuario } = usePostUsuario();
  const { roles } = useGetRoles();
  const [formData] = useState<Record<string, string>>({});

  const formFields: FormField[] = [
    {
      key: "nombre",
      label: "Nombre",
      type: "text",
      required: true,
      className: "col-span-1"
    },
    {
      key: "apellido",
      label: "Apellido",
      type: "text",
      required: true,
      className: "col-span-1"
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      required: true,
      className: "col-span-1"
    },
    {
      key: "password",
      label: "Contraseña",
      type: "password",
      required: true,
      className: "col-span-1"
    },
    {
      key: "rol_id",
      label: "Rol",
      type: "select",
      required: true,
      className: "col-span-2",
      options: roles.map(r => ({ value: r.id_rol, label: r.nombre_rol }))
    }
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const currentDate = new Date().toISOString();
      
      const createPayload = {
        id_usuario: 0, // El backend ignorará este valor
        nombre: values.nombre,
        apellido: values.apellido,
        edad: 0,
        cedula: "0",
        email: values.email,
        contrasena: values.password,
        telefono: "0",
        imagen: "",
        estado: true,
        fecha_registro: currentDate,
        rol_id: parseInt(values.rol_id)
      };

      await crearUsuario(createPayload);
      showSuccessToast('Usuario creado con éxito');
      
      if (onUsuarioCreated) {
        onUsuarioCreated();
      }
    } catch (error) {
      showErrorToast('Error al crear el usuario');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Crear Nuevo Usuario</h2>
      <div className="bg-gray-50/50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
        <Form
          fields={formFields}
          onSubmit={handleSubmit}
          buttonText="Crear"
          initialValues={{
            ...formData,
            fecha_creacion: new Date().toISOString().split('T')[0]
          }}
          schema={usuarioSchema}
        />
      </div>
    </div>
  );
};

export default UsuarioForm; 