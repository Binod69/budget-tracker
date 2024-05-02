import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { UserSettings } from '@prisma/client';
import axios from 'axios';
import { toast } from 'sonner';
import { TransactionType } from '@/types/types';

interface Props {
  type: TransactionType;
}

const useGetCategories = ({ type }: Props) => {
  return useQuery<UserSettings>({
    queryKey: ['categories', type],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`/api/categories?type=${type}`);
        return data;
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    },
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    retry: 2,
  });
};

export default useGetCategories;
