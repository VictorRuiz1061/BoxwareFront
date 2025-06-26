import { Image, Avatar } from "@heroui/react";
import { useState, useEffect } from "react";

interface ImagenProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  isAvatar?: boolean;
  fallbackSrc?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  onClick?: () => void;
}

// Mapa centralizado para modificar tamaños fácilmente
const SIZE_MAP = {
  sm: { w: 48, h: 48 },   // 3rem
  md: { w: 64, h: 64 },   // 4rem
  lg: { w: 96, h: 96 },   // 6rem
  xl: { w: 128, h: 128 }, // 8rem
};

/**
 * Componente Imagen
 * Muestra una imagen o avatar con fallback y tamaños personalizables.
 * Cambia los tamaños en SIZE_MAP arriba.
 */
const Imagen = ({
  src,
  alt = "Imagen",
  width,
  height,
  className = "",
  isAvatar = false,
  fallbackSrc = "/assets/default.jpg",
  size = "md",
  radius = "md",
  onClick
}: ImagenProps) => {
  const [error, setError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(src || fallbackSrc);

  // Actualizar la URL de la imagen cuando cambia src
  useEffect(() => {
    setImageUrl(src || fallbackSrc);
    setError(false); // Resetear el estado de error cuando cambia la URL
  }, [src, fallbackSrc]);

  // Manejar error de carga
  const handleError = () => {
    setError(true);
    setImageUrl(fallbackSrc);
  };

  // Dimensiones automáticas según size
  const { w, h } = SIZE_MAP[size] || SIZE_MAP.md;
  const imgWidth = width || w;
  const imgHeight = height || h;

  // Estilos de radio
  const radiusClass = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }[radius] || 'rounded-md';

  // Si es avatar, usar Avatar
  if (isAvatar) {
    return (
      <Avatar
        src={error ? fallbackSrc : imageUrl}
        alt={alt}
        className={`${radiusClass} ${className}`}
        style={{ width: imgWidth, height: imgHeight }}
        onError={handleError}
        onClick={onClick}
      />
    );
  }

  // Imagen normal
  return (
    <Image
      src={error ? fallbackSrc : imageUrl}
      alt={alt}
      width={imgWidth}
      height={imgHeight}
      className={`${radiusClass} object-cover ${className}`}
      onError={handleError}
      onClick={onClick}
      style={{ width: imgWidth, height: imgHeight }}
    />
  );
};

// Para cambiar los tamaños, solo modifica SIZE_MAP arriba.
// Ejemplo de uso:
// <Imagen src="url" size="lg" />
// <Imagen src="url" size="sm" radius="full" />

// Componente para mostrar imágenes en tablas con un tamaño predefinido
export const TablaImagen = ({ 
  src, 
  alt = "Imagen",
  size = "md" // Ahora aceptamos un parámetro de tamaño con valor predeterminado "md"
}: { 
  src: string; 
  alt?: string; 
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) => {
  // Estado para controlar cuando el mouse está sobre la imagen
  const [isHovered, setIsHovered] = useState(false);
  
  // Verificar si la URL es válida
  const isValidUrl = (url: string) => {
    try {
      return url && url.trim() !== '' && (url.startsWith('http') || url.startsWith('/'));
    } catch {
      return false;
    }
  };

  // Determinar dimensiones basadas en el tamaño
  const getDimensions = () => {
    switch (size) {
      case "sm": return "w-16 h-16";
      case "md": return "w-24 h-24";
      case "lg": return "w-32 h-32";
      case "xl": return "w-48 h-48";
      default: return "w-24 h-24";
    }
  };

  return (
    <div 
      className={`relative flex justify-center items-center ${getDimensions()}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen normal */}
      <Imagen
        src={src}
        alt={alt}
        size={size}
        className="mx-auto border border-gray-200 w-full h-full transition-all duration-300 ease-in-out"
        radius="sm"
      />
      
      {/* Imagen ampliada al hacer hover */}
      {isHovered && (
        <div className="absolute z-50 transform scale-150 -translate-y-1/2 top-1/2 shadow-xl rounded-md overflow-hidden transition-transform duration-300 ease-in-out">
          <Imagen
            src={src}
            alt={alt}
            size="xl"
            className="border-2 border-blue-500"
            radius="md"
          />
        </div>
      )}
    </div>
  );
};

export default Imagen;
