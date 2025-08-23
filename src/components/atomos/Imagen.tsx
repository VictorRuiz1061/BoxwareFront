import { Image, Avatar } from "@heroui/react";
import { useState, useEffect, FC } from "react";

interface ImagenProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  isAvatar?: boolean;
  fallbackSrc?: string;
  size?: "sm" | "md" | "lg" | "xl";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  onClick?: () => void;
}

const SIZE_MAP = {
  sm: { w: 48, h: 48 },
  md: { w: 64, h: 64 },
  lg: { w: 96, h: 96 },
  xl: { w: 128, h: 128 },
};

const Imagen: FC<ImagenProps> = ({
  src,
  alt = "Imagen",
  width,
  height,
  className = "",
  isAvatar = false,
  fallbackSrc = "/assets/default.jpg",
  size = "md",
  radius = "md",
  onClick,
}) => {
  const [error, setError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(src || fallbackSrc);

  useEffect(() => {
    setImageUrl(src || fallbackSrc);
    setError(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    setError(true);
    setImageUrl(fallbackSrc);
  };

  const { w, h } = SIZE_MAP[size] || SIZE_MAP.md;
  const imgWidth = width || w;
  const imgHeight = height || h;

  const radiusClass = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  }[radius] || "rounded-md";

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

export const TablaImagen: FC<{
  src: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
}> = ({ src, alt = "Imagen", size = "md" }) => {
  const [isHovered, setIsHovered] = useState(false);

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
      <Imagen
        src={src}
        alt={alt}
        size={size}
        className="mx-auto border border-gray-200 w-full h-full transition-all duration-300 ease-in-out"
        radius="sm"
      />

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
