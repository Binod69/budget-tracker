'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';

import type { TransactionType } from '@/types/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  createTransactionSchema,
  CreateTransactionSchemaType,
} from '@/schema/transaction';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CategoryPicker from './category-picker';
import { useCallback } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

interface Props {
  trigger: React.ReactNode;
  type: TransactionType;
}

const CreateTransationDialog = ({ trigger, type }: Props) => {
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type,
      date: new Date(),
    },
  });

  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue('category', value);
    },
    [form]
  );
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Create a new
              <span
                className={cn(
                  'm-1',
                  type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                )}
              >
                {type}
              </span>
              transaction
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input type="text" defaultValue={''} {...field} />
                    </FormControl>
                    <FormDescription>
                      Transaction description (optional)
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" defaultValue={0} {...field} />
                    </FormControl>
                    <FormDescription>
                      Transaction amount (required)
                    </FormDescription>
                  </FormItem>
                )}
              />
              Transaction: {form.watch('category')}
              <div className="flex items-center justify-between gap-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <CategoryPicker
                          type={type}
                          onChange={handleCategoryChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Select a category for this transaction
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Transaction date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-[200px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(value) => {
                              if (!value) return;
                              field.onChange(value);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Select a date for this</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTransationDialog;
