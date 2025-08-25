import axiosInstance from "@/api/axiosConfig";

export async function uploadImage(file: File): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append('imagen', file);

  const response = await axiosInstance.post("/materiales/upload-image", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
