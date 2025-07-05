import axios from '../axiosConfig';

export const forgotPassword = async (email: string) => {
    try {
      const response = await axios.post('/recuperar', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const verifyCode = async (email: string, codigo: string) => {
    try {
      const response = await axios.post('/verificar-codigo', { email, codigo });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const resetPassword = async (email: string, codigo: string, nuevaContrasena: string) => {
    try {
      const response = await axios.post('/restablecer', { 
        email,
        codigo,
        nuevaContrasena
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  