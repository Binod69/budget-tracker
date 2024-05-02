'use client';
import { useCallback, useEffect, useState } from 'react';
import { Category } from '@prisma/client';
import { Check, ChevronsUpDown } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TransactionType } from '@/types/types';
import CreateCategoryDialog from './create-category-dialog';
import { cn } from '@/lib/utils';
import useGetCategories from '@/hooks/useGetCategories';

interface Props {
  type: TransactionType;
  onChange: (value: string) => void;
}

const CategoryPicker = ({ type, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (!value) return;
    // when the value changes, call onChange callback
    onChange(value);
  }, [onChange, value]);

  const { data: categoriesQuery, isError, error } = useGetCategories(type);

  const selectedCategory = categoriesQuery?.find(
    (category: Category) => category.name === value
  );

  const successCallback = useCallback(
    (category: Category) => {
      setValue(category.name);
      setOpen((prev) => !prev);
    },
    [setValue, setOpen]
  );

  if (isError) {
    toast.error(error.message);
  }
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
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command onSubmit={(e) => e.preventDefault()}>
            <CommandInput placeholder="Search category..." />
            <CreateCategoryDialog
              type={type}
              successCallback={successCallback}
            />
            <CommandEmpty>
              <p>Category not found</p>
              <p className="text-xs text-muted-foreground">
                Tip: Create a new category
              </p>
            </CommandEmpty>
            <CommandGroup>
              <CommandList>
                {categoriesQuery &&
                  categoriesQuery?.map((category: Category) => (
                    <CommandItem
                      key={category.name}
                      onSelect={() => {
                        setValue(category.name);
                        setOpen((prev) => !prev);
                      }}
                    >
                      <CategoryRow category={category} />
                      <Check
                        className={cn(
                          'mr-2 w-4 h-4 opacity-0',
                          value === category.name && 'opacity-100'
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandList>
            </CommandGroup>
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
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
}
