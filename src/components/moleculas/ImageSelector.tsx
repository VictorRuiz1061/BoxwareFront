import React from 'react';
import { showSuccessToast } from "@/components/atomos/Toast";

interface ImageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const ImageSelector = ({ value, onChange, label = "Imagen" }: ImageSelectorProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Crear una ruta relativa para la imagen
      const imagePath = `/assets/${file.name}`;
      onChange(imagePath);
      
      // Mostrar mensaje de confirmación
      showSuccessToast(`Imagen seleccionada: ${file.name}`);
    }
  };
  
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="flex items-center">
        <input 
          type="text" 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)}
          className="flex-grow p-2 border rounded-md mr-2" 
          placeholder="Ruta de la imagen"
        />
        <label className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors">
          <span className="mr-2">Examinar</span>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      
      {value && (
        <div className="mt-2">
          <div className="border p-2 bg-gray-50 rounded-md">
            <img 
              src={value} 
              alt="Vista previa" 
              className="h-24 object-contain mx-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSelector;
