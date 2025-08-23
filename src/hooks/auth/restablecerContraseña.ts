import { useMutation } from '@tanstack/react-query';
import { forgotPassword, verifyCode, resetPassword } from '@/api/auth/restablecerContraseña';

export const useForgotPassword = () => {
    const forgotPasswordMutation = useMutation({
      mutationFn: (email: string) => {
        console.log('✅ Enviando solicitud de recuperación con email:', email);
        return forgotPassword(email);
      },
      onSuccess: (data) => {
        console.log('✅ Éxito en forgotPassword:', data);
      },
      onError: (error) => {
        console.error('❌ Error en forgotPassword:', error);
      }
    });
  
    return forgotPasswordMutation;
  };
  
  export const useVerifyCode = () => {
    const verifyCodeMutation = useMutation({
      mutationFn: ({ email, codigo }: { email: string; codigo: string }) => {
        console.log('🔍 Verificando código:', { email, codigo });
        return verifyCode(email, codigo);
      },
      onSuccess: (data) => {
        console.log('✅ Código verificado con éxito:', data);
      },
      onError: (error) => {
        console.error('❌ Error al verificar código:', error);
      }
    });
  
    return verifyCodeMutation;
  };
  
  export const useResetPassword = () => {
    const resetPasswordMutation = useMutation({
      mutationFn: ({ 
        email, 
        codigo,
        nuevaContrasena 
      }: { 
        email: string;
        codigo: string;
        nuevaContrasena: string;
      }) => {
        console.log('🔐 Intentando restablecer contraseña:', { email, codigo, nuevaContrasena });
        return resetPassword(email, codigo, nuevaContrasena);
      },
      onSuccess: (data) => {
        console.log('✅ Contraseña restablecida con éxito:', data);
      },
      onError: (error: any) => {
        console.error('❌ Error al restablecer contraseña:', error);
        console.error('Detalles del error:', {
          message: error.message,
          response: error.response?.data
        });
      }
    });
  
    return resetPasswordMutation;
  };