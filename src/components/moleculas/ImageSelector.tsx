import { useState, useEffect } from 'react';
import { TablaImagen, showErrorToast } from '../atomos';
import { validateImage, createImagePreview, revokeImagePreview } from '@/utils/imageUtils';

interface ImageSelectorProps {
  label: string;
  value: string;
  onChange: (value: string | File) => void;
  onError?: (error: string) => void;
}

const ImageSelector = ({ label, value, onChange, onError }: ImageSelectorProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>(value);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    setPreviewUrl(value);
  }, [value]);

  // Limpiar la URL de vista previa cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        revokeImagePreview(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsValidating(true);

      // Validar la imagen antes de procesarla
      const validation = await validateImage(file);
      if (!validation.valid) {
        const errorMsg = validation.error || 'Error de validación de imagen';
        showErrorToast(errorMsg);
        onError?.(errorMsg);
        return;
      }

      // Crear vista previa temporal
      const tempPreviewUrl = createImagePreview(file);
      setPreviewUrl(tempPreviewUrl);
      setSelectedFile(file);

      // Notificar al componente padre que se seleccionó un archivo
      onChange(file);

      showErrorToast('Imagen seleccionada correctamente. Se guardará cuando envíes el formulario.');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido al procesar la imagen';
      showErrorToast(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsValidating(false);
    }
  };

  const clearImage = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      revokeImagePreview(previewUrl);
    }
    setPreviewUrl('/assets/default.jpg');
    setSelectedFile(null);
    onChange('');
  };
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>
      <div className="flex flex-col items-center space-y-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
        <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm relative">
          <TablaImagen
            src={previewUrl || '/assets/default.jpg'}
            alt="Vista previa"
            size="lg"
          />
          
          {/* Indicador de validación */}
          {isValidating && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="text-white text-xs font-medium">
                Validando...
              </div>
            </div>
          )}

          {/* Indicador de imagen seleccionada */}
          {selectedFile && !isValidating && (
            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              ✓
            </div>
          )}
        </div>
        
        <div className="w-full space-y-2">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange}
            disabled={isValidating}
            className={`w-full text-sm text-gray-600 dark:text-gray-300
              file:mr-4 file:py-2 file:px-4 
              file:rounded-full file:border-0 
              file:text-sm file:font-semibold
              file:bg-blue-500 file:text-white
              hover:file:bg-blue-600
              dark:file:bg-blue-600
              dark:file:text-white
              dark:file:hover:bg-blue-700
              transition-colors
              ${isValidating ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          
          {/* Botón para limpiar imagen */}
          {selectedFile && (
            <button
              type="button"
              onClick={clearImage}
              className="w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 border border-red-300 dark:border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Limpiar imagen seleccionada
            </button>
          )}
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 space-y-1">
          <p>• Formatos permitidos: JPG, PNG, GIF, WebP</p>
          <p>• Tamaño máximo: 50MB</p>
          <p>• Sin restricciones de dimensiones (8K, 4K, etc.)</p>
          <p>• La imagen se guardará cuando envíes el formulario</p>
          {selectedFile && (
            <p className="text-green-600 dark:text-green-400 font-medium">
              ✓ Imagen válida: {selectedFile.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageSelector;
