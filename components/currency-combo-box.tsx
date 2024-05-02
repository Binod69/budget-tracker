'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { UserSettings } from '@prisma/client';
import { toast } from 'sonner';

import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Currencies, Currency } from '@/lib/currencies';
import useGetUserSetting from '@/hooks/useGetUserSetting';
import SkeletonWrapper from './skeleton-wrapper';
import { UpdateUserCurrency } from '@/app/(dashboard)/set-currency/_actions/userSettings';

export function CurrencyComboBox() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [selectedOption, setSelectedOption] = useState<Currency | null>(null);

  const {
    data: userSettingData,
    isError,
    error,
    isFetching,
  } = useGetUserSetting();

  const mutation = useMutation({
    mutationFn: UpdateUserCurrency,
    mutationKey: ['user-settings'],
    onSuccess: (data: UserSettings) => {
      toast.success('Currency updated successfully', {
        id: 'update-currency',
      });
      setSelectedOption(
        Currencies.find((c) => c.value === data.currency) || null
      );
    },
    onError: (error) => {
      console.log(error);
      toast.error('something went wrong', {
        id: 'update-currency',
      });
    },
  });

  const selectedOptions = useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        toast.error('Please select a currency');
        return;
      }
      toast.loading('Updating currency...', {
        id: 'update-currency',
      });
      mutation.mutate(currency.value);
    },
    [mutation]
  );

  useEffect(() => {
    if (!userSettingData) return;
    const userCurrency = Currencies.find(
      (currency) => currency.value === userSettingData.currency
    );
    if (userCurrency) setSelectedOption(userCurrency);
  }, [userSettingData]);

  if (isError) {
    toast.error(error.message);
    return;
  }

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={mutation.isPending}
            >
              {selectedOption ? <>{selectedOption.label}</> : <>Set Currency</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <OptionList setOpen={setOpen} setSelectedOption={selectedOptions} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={mutation.isPending}
          >
            {selectedOption ? <>{selectedOption.label}</> : <> Set Currency</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <OptionList setOpen={setOpen} setSelectedOption={selectedOptions} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
}

function OptionList({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOption: (status: Currency | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter currency..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency: Currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedOption(
                  Currencies.find((priority) => priority.value === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
