import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer";
import Boton from "../atomos/Boton"; // Asegúrate de que la ruta sea correcta

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
  },
  tableCell: {
    flex: 1,
    margin: 2,
    padding: 5,
    fontSize: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    textAlign: "center",
    wordWrap: "break-word",
  },
  headerCell: {
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
});

// Componente del documento PDF
export const MyDocument = ({ title, subtitle, data }: { title: string; subtitle: string; data: any[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Título */}
      <Text style={styles.title}>{title}</Text>

      {/* Subtítulo */}
      <Text style={styles.subtitle}>{subtitle}</Text>

      {/* Tabla dinámica */}
      <View style={styles.table}>
        {/* Encabezado de la tabla */}
        <View style={styles.tableRow}>
          {Object.keys(data[0] || {}).map((key) => (
            <Text key={key} style={[styles.tableCell, styles.headerCell]}>
              {key.toUpperCase()}
            </Text>
          ))}
        </View>

        {/* Filas de datos */}
        {data.map((row, index) => (
          <View key={index} style={styles.tableRow}>
            {Object.values(row).map((value, i) => (
              <Text key={i} style={styles.tableCell}>
                {String(value)}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

// Componente para descargar el PDF
const Pdf = ({ title, subtitle, data, fileName }: { title: string; subtitle: string; data: any[]; fileName: string }) => (
  <div>
    <PDFDownloadLink
      document={<MyDocument title={title} subtitle={subtitle} data={data} />}
      fileName={fileName}
    >
      {({ loading }) => (
        <Boton>
          {loading ? "Cargando Documento..." : "Descargar PDF"}
        </Boton>
      )}
    </PDFDownloadLink>
  </div>
);

export default Pdf;