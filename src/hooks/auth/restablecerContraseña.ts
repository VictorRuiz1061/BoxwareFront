import { useMutation } from '@tanstack/react-query';
import { forgotPassword, verifyCode, resetPassword } from '@/api/auth/restablecerContraseña';

export const useForgotPassword = () => {
    const forgotPasswordMutation = useMutation({
      mutationFn: forgotPassword,
    });
  
    return forgotPasswordMutation;
  };
  
  export const useVerifyCode = () => {
    const verifyCodeMutation = useMutation({
      mutationFn: ({ email, codigo }: { email: string; codigo: string }) => 
        verifyCode(email, codigo),
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
        nuevaContrasena: string 
      }) => resetPassword(email, codigo, nuevaContrasena),
    });
  
    return resetPasswordMutation;
  };
  