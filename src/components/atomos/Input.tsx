import React from "react";

type InputProps = {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({ label, type = "text", placeholder, value, onChange, disabled }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-gray-600 font-medium">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
      />
    </div>
  );
};

export default Input;






/* -----------------------------------uso---------------------------------- */



/* import React, { useState } from "react";
import Input from "./components/Input";

const App: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center">Formulario de Usuario</h1>

      Input para Nombre 
      <Input
        label="Nombre"
        placeholder="Escribe tu nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      Input para Correo
      <Input
        label="Correo Electrónico"
        type="email"
        placeholder="ejemplo@correo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

       Input para Contraseña 
      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full">
        Enviar
      </button>
    </div>
  );
};

export default App;
 */