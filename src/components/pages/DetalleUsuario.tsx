import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";
import { useGetUsuarios } from "../../hooks/usuario/useGetUsuarios";
import { useGetFichas } from "../../hooks/fichas/useGetFichas";
import { useGetRoles } from "../../hooks/roles/useGetRoles";
import { useGetProgramas } from "../../hooks/programas/useGetProgramas";
import { useMateriales } from "../../hooks/useMateriales";
import { useSitios } from "../../hooks/useSitios";
import { useGetSedes } from "../../hooks/sedes/useGetSedes";
import { useGetCentros } from "../../hooks/centros/useGetCentros";
import { useGetMunicipios } from "../../hooks/municipios/useGetMunicipios";
import Sidebar from "../organismos/Sidebar";
import Header from "../organismos/Header";
import Boton from "../atomos/Boton";

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
    minHeight: 25,
    alignItems: "center",
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  field: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: "40%",
    fontWeight: "bold",
    fontSize: 12,
  },
  value: {
    width: "60%",
    fontSize: 12,
  },
});

// Componente del documento PDF
const InformeUsuarioPDF = ({ userData }: { userData: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Informe Completo de Usuario</Text>
      <Text style={styles.subtitle}>Sistema BoxWare</Text>

      {/* Sección de Datos Personales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos Personales</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{userData.usuario?.nombre} {userData.usuario?.apellido}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Cédula:</Text>
          <Text style={styles.value}>{userData.usuario?.cedula}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{userData.usuario?.email}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value}>{userData.usuario?.telefono}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Fecha de Registro:</Text>
          <Text style={styles.value}>
            {userData.usuario?.fecha_registro ? new Date(userData.usuario.fecha_registro).toLocaleDateString() : "N/A"}
          </Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Estado:</Text>
          <Text style={styles.value}>{userData.usuario?.esta_activo ? "Activo" : "Inactivo"}</Text>
        </View>
      </View>

      {/* Sección de Rol */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rol y Permisos</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Rol:</Text>
          <Text style={styles.value}>{userData.rol?.nombre_rol || "Sin rol asignado"}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Descripción:</Text>
          <Text style={styles.value}>{userData.rol?.descripcion || "N/A"}</Text>
        </View>
      </View>

      {/* Sección de Ficha y Programa */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ficha y Programa</Text>
        {userData.ficha ? (
          <>
            <View style={styles.field}>
              <Text style={styles.label}>ID Ficha:</Text>
              <Text style={styles.value}>{userData.ficha.id_ficha}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Programa:</Text>
              <Text style={styles.value}>{userData.programa?.nombre_programa || "Programa no encontrado"}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Fecha de Creación:</Text>
              <Text style={styles.value}>
                {userData.ficha.fecha_creacion ? new Date(userData.ficha.fecha_creacion).toLocaleDateString() : "N/A"}
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.value}>El usuario no tiene ficha asignada</Text>
        )}
      </View>

      {/* Sección de Sitio */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sitio Asignado</Text>
        {userData.sitio ? (
          <>
            <View style={styles.field}>
              <Text style={styles.label}>Nombre del Sitio:</Text>
              <Text style={styles.value}>{userData.sitio.nombre_sitio}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Ubicación:</Text>
              <Text style={styles.value}>{userData.sitio.ubicacion}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Tipo de Sitio:</Text>
              <Text style={styles.value}>{userData.tipoSitio?.nombre || "N/A"}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Municipio:</Text>
              <Text style={styles.value}>{userData.municipio?.nombre || "N/A"}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Sede:</Text>
              <Text style={styles.value}>{userData.sede?.nombre || "N/A"}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Centro:</Text>
              <Text style={styles.value}>{userData.centro?.nombre || "N/A"}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.value}>El usuario no tiene sitio asignado</Text>
        )}
      </View>

      {/* Sección de Materiales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Materiales Asociados</Text>
        {userData.materiales && userData.materiales.length > 0 ? (
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Código</Text>
              <Text style={styles.tableCell}>Nombre</Text>
              <Text style={styles.tableCell}>Stock</Text>
              <Text style={styles.tableCell}>Unidad</Text>
            </View>
            {userData.materiales.map((material: any, index: number) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{material.codigo_sena}</Text>
                <Text style={styles.tableCell}>{material.nombre_material}</Text>
                <Text style={styles.tableCell}>{material.stock}</Text>
                <Text style={styles.tableCell}>{material.unidad_medida}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.value}>No hay materiales asociados a este usuario</Text>
        )}
      </View>
    </Page>
  </Document>
);

const DetalleUsuario = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuarios } = useGetUsuarios();
  const { fichas } = useGetFichas();
  const { roles } = useGetRoles();
  const { programas } = useGetProgramas();
  const { materiales } = useMateriales();
  const { sitios } = useSitios();
  const { sedes } = useGetSedes();
  const { centros } = useGetCentros();
  const { municipios } = useGetMunicipios();
  
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Si no hay un ID, usamos el primer usuario disponible
        const userIdToUse = id ? parseInt(id) : (usuarios.length > 0 ? usuarios[0].id_usuario : null);
        
        if (!userIdToUse) {
          console.error("No hay usuarios disponibles");
          setLoading(false);
          return;
        }

        // Encontrar el usuario
        const usuario = usuarios.find(u => u.id_usuario === userIdToUse);
        if (!usuario) {
          console.error(`Usuario con ID ${userIdToUse} no encontrado`);
          setLoading(false);
          return;
        }

        // Encontrar el rol del usuario
        const rol = roles.find(r => r.id_rol === usuario.rol_id);
        
        // Encontrar la ficha del usuario
        const ficha = fichas.find(f => f.usuario_ficha_id === usuario.id_usuario);
        
        // Si hay ficha, encontrar el programa
        const programa = ficha ? programas.find(p => p.id_programa === ficha.programa_id) : null;

        // Encontrar sitio donde el usuario es encargado
        const sitio = sitios.find(s => s.persona_encargada_id === usuario.id_usuario);
        
        // Encontrar materiales relacionados con el sitio (si existe)
        const materialesRelacionados = sitio 
          ? materiales.filter(m => m.sitio_id === sitio.id_sitio)
          : [];

        // Encontrar la sede del sitio (si existe)
        const sede = sitio ? sedes.find(s => s.id_sede === sitio.sede_id) : null;
        // Encontrar el centro de la sede (si existe)
        const centro = sede ? centros.find(c => c.id_centro === sede.centro_sede_id) : null;
        // Encontrar el municipio del centro (si existe)
        const municipio = centro ? municipios.find(m => m.id_municipio === centro.municipio_id) : null;

        // Construir objeto con todos los datos
        const userData = {
          usuario,
          rol,
          ficha,
          programa,
          sitio,
          tipoSitio: sitio ? sitio.tipo_sitio_id : null,
          sede,
          centro,
          municipio,
          materiales: materialesRelacionados
        };

        setUserData(userData);
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, usuarios, fichas, roles, programas, materiales, sitios, sedes, centros, municipios]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Informe Detallado de Usuario</h1>
            <div className="flex gap-2">
              <Boton
                onClick={handleBack}
                className="bg-gray-500 text-white px-4 py-2"
              >
                Volver
              </Boton>
              
              {!loading && userData && (
                <PDFDownloadLink
                  document={<InformeUsuarioPDF userData={userData} />}
                  fileName={`informe-usuario-${userData.usuario?.nombre || 'detalle'}.pdf`}
                  className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
                >
                  {({ loading }) => 
                    loading ? "Preparando PDF..." : "Descargar Informe PDF"
                  }
                </PDFDownloadLink>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Cargando información del usuario...</div>
          ) : userData ? (
            <div className="bg-white shadow-md rounded-lg p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Datos Personales */}
              <div className="border rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4 bg-gray-100 p-2 rounded">Datos Personales</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Nombre:</p>
                    <p>{userData.usuario?.nombre} {userData.usuario?.apellido}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Cédula:</p>
                    <p>{userData.usuario?.cedula}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Email:</p>
                    <p>{userData.usuario?.email}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Teléfono:</p>
                    <p>{userData.usuario?.telefono}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Estado:</p>
                    <p className={userData.usuario?.esta_activo ? "text-green-600" : "text-red-600"}>
                      {userData.usuario?.esta_activo ? "Activo" : "Inactivo"}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Fecha Registro:</p>
                    <p>{userData.usuario?.fecha_registro ? new Date(userData.usuario.fecha_registro).toLocaleDateString() : "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Rol */}
              <div className="border rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4 bg-gray-100 p-2 rounded">Rol y Permisos</h2>
                {userData.rol ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Rol:</p>
                      <p>{userData.rol.nombre_rol}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Descripción:</p>
                      <p>{userData.rol.descripcion}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-yellow-600">El usuario no tiene un rol asignado</p>
                )}
              </div>

              {/* Ficha y Programa */}
              <div className="border rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4 bg-gray-100 p-2 rounded">Ficha y Programa</h2>
                {userData.ficha ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">ID Ficha:</p>
                      <p>{userData.ficha.id_ficha}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Programa:</p>
                      <p>{userData.programa?.nombre_programa || "Programa no encontrado"}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Fecha Creación:</p>
                      <p>{userData.ficha.fecha_creacion ? new Date(userData.ficha.fecha_creacion).toLocaleDateString() : "N/A"}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-yellow-600">El usuario no tiene ficha asignada</p>
                )}
              </div>

              {/* Sitio */}
              <div className="border rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4 bg-gray-100 p-2 rounded">Sitio Asignado</h2>
                {userData.sitio ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Nombre del Sitio:</p>
                      <p>{userData.sitio.nombre_sitio}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Ubicación:</p>
                      <p>{userData.sitio.ubicacion}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-yellow-600">El usuario no es encargado de ningún sitio</p>
                )}
              </div>

              {/* Materiales */}
              <div className="border rounded-lg p-4 col-span-1 lg:col-span-2">
                <h2 className="text-xl font-bold mb-4 bg-gray-100 p-2 rounded">Materiales Asociados</h2>
                {userData.materiales && userData.materiales.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userData.materiales.map((material: any) => (
                          <tr key={material.id_material}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.codigo_sena}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.nombre_material}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.descripcion_material}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.stock}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.unidad_medida}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-yellow-600">No hay materiales asociados a este usuario</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-red-500">No se pudo cargar la información del usuario</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DetalleUsuario; 