interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="relative mx-auto flex min-h-screen max-w-[1400px] flex-col p-2 sm:p-4">
      {children}
    </div>
  );
}
