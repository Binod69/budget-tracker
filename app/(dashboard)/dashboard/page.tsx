import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import CreateTransationDialog from './_components/create-transation-dialog';

const page = async () => {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const userSetting = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSetting) {
    redirect('/set-currency');
  }

  return (
    <>
      <div className="h-full bg-background">
        <div className="border-b bg-card">
          <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
            <p className="text-3xl font-bold">Hello, {user.firstName}! 👋</p>
            <div className="flex items-center gap-3">
              <CreateTransationDialog
                trigger={
                  <Button
                    variant={'outline'}
                    className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
                  >
                    New income 🤑
                  </Button>
                }
                type="income"
              />
              <CreateTransationDialog
                trigger={
                  <Button
                    variant={'outline'}
                    className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white"
                  >
                    New Expense 😢
                  </Button>
                }
                type="expense"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
