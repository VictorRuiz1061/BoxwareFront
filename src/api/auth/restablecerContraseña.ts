import axios from '../axiosConfig';

export const forgotPassword = async (email: string) => {
    try {
      // Usar fetch en lugar de axios para probar
      const response = await fetch('http://localhost:3000/recuperar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw { 
          response: { 
            status: response.status, 
            data: data 
          } 
        };
      }
      
      return data;
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
      // Verificar que todos los campos tengan valores
      if (!email || !codigo || !nuevaContrasena) {
        throw new Error('Todos los campos son requeridos');
      }
      
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