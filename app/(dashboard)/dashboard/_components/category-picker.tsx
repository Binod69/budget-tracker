'use client';
import { Button } from '@/components/ui/button';
import { Command, CommandInput } from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import useGetCategories from '@/hooks/useGetCategories';
import { TransactionType } from '@/types/types';
import { Category } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import CreateCategoryDialog from './create-category-dialog';

interface Props {
  type: TransactionType;
}

const CategoryPicker = ({ type }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  //   const { data, isFetching, isError, error } = useGetCategories({ type });
  const categoriesQuery = useQuery({
    queryKey: ['categories', type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const selectedCategory = categoriesQuery.data?.find(
    (category: Category) => category.name === value
  );
  const successCallback = useCallback(
    (category: Category) => {
      setValue(category.name);
      setOpen((prev) => !prev);
    },
    [setValue, setOpen]
  );

  //   if (isError) {
  //     toast.error(error.message);
  //   }
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {selectedCategory ? (
              <CategoryRow category={selectedCategory} />
            ) : (
              'Select category'
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command onSubmit={(e) => e.preventDefault()}>
            <CommandInput placeholder="Search category..." />
            <CreateCategoryDialog
              type={type}
              successCallback={successCallback}
            />
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default CategoryPicker;

function CategoryRow({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{category.name}</span>
      <span>{category.name}</span>
    </div>
  );
}
