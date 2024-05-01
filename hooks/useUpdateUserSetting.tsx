import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UpdateUserCurrency } from '@/app/(dashboard)/set-currency/_actions/userSettings';
import { Currency } from '@/lib/currencies';

const useUpdateUserSettings = async () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UpdateUserCurrency,

    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['user-settings'] });
      const prevData = queryClient.getQueryData(['user-settings']);
      queryClient.setQueryData(['user-settings'], newData);
    },
  });
};

export default useUpdateUserSettings;
