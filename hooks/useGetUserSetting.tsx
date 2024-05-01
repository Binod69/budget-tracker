import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { UserSettings } from '@prisma/client';
import axios from 'axios';
import { toast } from 'sonner';

const useGetUserSetting = () => {
  return useQuery<UserSettings>({
    queryKey: ['user-settings'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/user-settings');
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

export default useGetUserSetting;
