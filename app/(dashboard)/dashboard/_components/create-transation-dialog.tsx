'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CategoryPicker from './category-picker';

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
              <div className="flex items-center justify-between gap-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <CategoryPicker type={type} />
                      </FormControl>
                      <FormDescription>
                        Transaction amount (required)
                      </FormDescription>
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