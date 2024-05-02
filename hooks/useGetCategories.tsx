import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Category } from '@prisma/client';

import type { TransactionType } from '@/types/types';

const useGetCategories = (type: TransactionType) => {
  const categoriesQuery = useQuery<Category[]>({
    queryKey: ['categories', type],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/categories?type=${type}`);
        return response.data;
      } catch (error) {
        throw new Error('Failed to fetch categories');
      }
    },
  });

  return categoriesQuery;
};

export default useGetCategories;
