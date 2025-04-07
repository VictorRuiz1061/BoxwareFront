interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 relative"
      style={{ backgroundImage: "url('/assets/image.png')" }}
    >
      {/* Overlay with blur effect */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>

      <div className="max-w-4xl w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 border border-white/20">
        {/* Left side - Image */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center relative overflow-hidden"
          style={{ backgroundImage: "url('/assets/image.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 mix-blend-overlay"></div>
        </div>

        {/* Right side - Content */}
        <div className="w-full md:w-1/2 py-12 px-8 md:px-12 backdrop-blur-md bg-white/40">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow-sm">{title}</h1>
            <p className="mt-3 text-base text-gray-700">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};
