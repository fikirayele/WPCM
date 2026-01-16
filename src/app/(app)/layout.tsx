import { AppSidebar } from './_components/app-sidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-auto bg-primary/5 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
