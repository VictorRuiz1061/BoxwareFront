import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { uploadImage } from '@/api';
import { validateImage } from '@/utils';

export interface UseImageUploadOptions {
  onSuccess?: (imageUrl: string) => void;
  onError?: (error: string) => void;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Validar la imagen antes de subirla
      const validation = await validateImage(file);
      if (!validation.valid) {
        throw new Error(validation.error || 'Error de validación de imagen');
      }

      // Simular progreso de carga
      setUploadProgress(25);
      
      const result = await uploadImage(file);
      
      setUploadProgress(100);
      
      if (!result.success || !result.imageUrl) {
        throw new Error(result.message || 'Error al procesar la imagen');
      }

      return result.imageUrl;
    },
    onSuccess: (imageUrl) => {
      setUploadProgress(0);
      options.onSuccess?.(imageUrl);
    },
    onError: (error: Error) => {
      setUploadProgress(0);
      options.onError?.(error.message);
    }
  });

  return {
    uploadImage: uploadMutation.mutate,
    uploadImageAsync: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    uploadProgress,
    error: uploadMutation.error?.message
  };
} 