import { useState, useEffect } from 'react';
import { TablaImagen } from '../atomos';

interface ImageSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ImageSelector = ({ label, value, onChange }: ImageSelectorProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>(value);

  useEffect(() => {
    setPreviewUrl(value);
  }, [value]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Crear una URL temporal para la vista previa
      const tempPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(tempPreviewUrl);

      // Generar la ruta relativa para guardar
      const fileName = file.name;
      const imagePath = `/assets/${fileName}`;
      onChange(imagePath);

      // Limpiar la URL temporal cuando el componente se desmonte
      return () => URL.revokeObjectURL(tempPreviewUrl);
    }
  };
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>
      <div className="flex flex-col items-center space-y-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
        <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm">
          <TablaImagen
            src={previewUrl || '/assets/default.jpg'}
            alt="Vista previa"
            size="lg"
          />
        </div>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange}
          className="w-full text-sm text-gray-600 dark:text-gray-300
            file:mr-4 file:py-2 file:px-4 
            file:rounded-full file:border-0 
            file:text-sm file:font-semibold
            file:bg-blue-500 file:text-white
            hover:file:bg-blue-600
            dark:file:bg-blue-600
            dark:file:text-white
            dark:file:hover:bg-blue-700
            transition-colors"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          * La imagen seleccionada debe estar en la carpeta /public/assets/
        </p>
      </div>
    </div>
  );
};

export default ImageSelector;
