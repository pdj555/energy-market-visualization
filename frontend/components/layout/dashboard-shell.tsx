interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[1320px] flex-col px-3 py-3 sm:px-6 sm:py-5 lg:px-8">
      {children}
    </div>
  );
}
