import Sidebar from '../organismos/Sidebar';
import Header from '../organismos/Header';

const PaginaInicio = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Contenido */}
        <main className="flex-1 overflow-y-auto">

        
        </main>
      </div>
    </div>
  );
};

export default PaginaInicio;
