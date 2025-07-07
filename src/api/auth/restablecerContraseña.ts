import axios from '../axiosConfig';

export const forgotPassword = async (email: string) => {
    console.log('📧 Solicitando recuperación para email:', email);
    try {
      const response = await axios.post('/recuperar', { email });
      console.log('📧 Respuesta de recuperación:', response.data);
      return response.data;
    } catch (error) {
      console.error('📧 Error en recuperación:', error);
      throw error;
    }
  };
  
  export const verifyCode = async (email: string, codigo: string) => {
    console.log('🔢 Verificando código:', { email, codigo });
    try {
      const response = await axios.post('/verificar-codigo', { email, codigo });
      console.log('🔢 Respuesta de verificación:', response.data);
      return response.data;
    } catch (error) {
      console.error('🔢 Error en verificación:', error);
      throw error;
    }
  };
  
  export const resetPassword = async (email: string, codigo: string, nuevaContrasena: string) => {
    console.log('🔐 Enviando solicitud de restablecimiento:', {
      email,
      codigo,
      nuevaContrasena: nuevaContrasena ? '********' : 'VACÍO' // No mostrar la contraseña en logs
    });
    
    try {
      // Verificar que todos los campos tengan valores
      if (!email || !codigo || !nuevaContrasena) {
        console.error('🔐 Error: Faltan campos requeridos', {
          tieneEmail: !!email,
          tieneCodigo: !!codigo,
          tieneContrasena: !!nuevaContrasena
        });
        throw new Error('Todos los campos son requeridos');
      }
      
      const response = await axios.post('/restablecer', { 
        email,
        codigo,
        nuevaContrasena
      });
      
      console.log('🔐 Respuesta de restablecimiento:', response.data);
      return response.data;
    } catch (error) {
      console.error('🔐 Error en restablecimiento:', error);
      throw error;
    }
  };
  