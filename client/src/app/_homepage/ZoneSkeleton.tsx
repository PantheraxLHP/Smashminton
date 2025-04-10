import { Skeleton } from '@/components/ui/skeleton';

export default function ZoneSkeleton() {
    return (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((index) => (
                <div key={index} className="group overflow-hidden rounded-xl bg-white shadow-md">
                    <Skeleton className="relative h-56 w-full" />

                    <div className="space-y-4 p-5">
                        <Skeleton className="h-6 w-3/4" />

                        <Skeleton className="h-4 w-1/2" />

                        <div className="flex items-center justify-between pt-2">
                            <Skeleton className="h-5 w-1/3" />
                            <Skeleton className="h-9 w-24" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
