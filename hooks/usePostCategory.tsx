import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CreateCategory } from '@/app/(dashboard)/dashboard/_actions/categories';
import { Category } from '@prisma/client';

const usePostCategory = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ['categories'],
    mutationFn: CreateCategory,
    onSuccess: async (data: Category) => {
      toast.success(`Category ${data.name} created successfully 🎉`, {
        id: 'create-category',
      });
      await queryClient.invalidateQueries({
        queryKey: ['categories'],
      });
    },
    onError: () => {
      toast.error('Something went wrong', {
        id: 'create-category',
      });
    },
  });

  return { mutate, isPending, isError, error };
};

export default usePostCategory;
