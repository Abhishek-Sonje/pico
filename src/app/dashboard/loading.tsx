import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main
      className="min-h-screen bg-background"
      aria-label="Loading opportunity radar"
    >
      <div className="bg-foreground px-5 py-5 sm:px-6">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40 bg-background/15" />
            <Skeleton className="h-3 w-72 max-w-full bg-background/10" />
          </div>
          <div className="grid flex-1 grid-cols-2 gap-px bg-background/10 sm:grid-cols-4 lg:max-w-3xl">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="bg-foreground p-4">
                <Skeleton className="h-3 w-16 bg-background/10" />
                <Skeleton className="mt-3 h-7 w-10 bg-background/15" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-5 py-10 lg:px-8 lg:py-12">
        <Skeleton className="h-12 w-full max-w-3xl sm:h-16" />
        <Skeleton className="mt-4 h-5 w-full max-w-xl" />
        <div className="mt-9 grid gap-3 border-y border-border py-4 lg:grid-cols-[1fr_auto]">
          <Skeleton className="h-11 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-11 w-32" />
            <Skeleton className="h-11 w-28" />
            <Skeleton className="h-11 w-24" />
          </div>
        </div>
        <div className="mt-9 grid gap-10 xl:grid-cols-[1.35fr_.65fr]">
          <div>
            <Skeleton className="h-6 w-44" />
            <Skeleton className="mt-3 h-4 w-72 max-w-full" />
            <Skeleton className="mt-5 h-[470px] w-full rounded-none" />
          </div>
          <div>
            <Skeleton className="h-6 w-36" />
            <Skeleton className="mt-3 h-4 w-56" />
            <div className="mt-5 divide-y divide-border border-y border-border">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="flex items-center gap-3 py-4">
                  <Skeleton className="size-6 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="mt-2 h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-11 w-20 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
