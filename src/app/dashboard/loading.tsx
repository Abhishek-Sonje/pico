import { Skeleton } from "@/components/ui/skeleton";
export default function DashboardLoading() {
  return (
    <main className="mx-auto min-h-screen max-w-[1500px] px-5 py-12">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="mt-8 h-24 w-full" />
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-72" />
        ))}
      </div>
    </main>
  );
}
