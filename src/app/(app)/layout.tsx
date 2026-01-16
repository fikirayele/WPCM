import { AppSidebar } from './_components/app-sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r bg-card lg:flex">
        <div className="flex h-16 shrink-0 items-center border-b px-6">
          <Logo />
        </div>
        <AppSidebar />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card px-4 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-64 flex-col p-0">
               <SheetTitle className="sr-only">Sidebar Menu</SheetTitle>
               <div className="flex h-16 shrink-0 items-center border-b px-6">
                <Logo />
               </div>
               <AppSidebar />
            </SheetContent>
          </Sheet>
          <div className="flex-1 text-center">
            <Logo />
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-primary/5 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
