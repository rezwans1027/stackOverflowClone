import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
    return (
        <section>
            <h1 className='h1-bold text-dark100_light900'>Tags</h1>

            <div className='mb-12 mt-11 flex flex-wrap items-center justify-between gap-5'>
                <Skeleton className='h-14 flex-1 bg-slate-300 dark:bg-slate-700' />
                <Skeleton className='h-14 w-28 bg-slate-300 dark:bg-slate-700' />
            </div>

            <div className='flex flex-wrap justify-center gap-4'>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((item) => (
                    <Skeleton
                        key={item}
                        className='h-48 w-[190px] rounded-2xl bg-slate-300 dark:bg-slate-700 '
                    />
                ))}
            </div>
        </section>
    );
};

export default Loading;