"use client"

import { GlobalSearchFilters } from '@/constants/filters';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const GlobalFilters = () => {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [filterValue, setFilterValue] = useState(searchParams.get('type') || '');

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        const currentFilter = params.get('filter') || '';

        if (filterValue !== currentFilter) {
            if (filterValue && filterValue !== 'none') {
                params.set('type', filterValue);
            } else {
                params.delete('type');
            }

            params.delete('page');
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });

        }
    }, [searchParams, pathname, router, filterValue]);

    const clickHandler = (value: string) => {
        setFilterValue(filterValue === value ? 'none' : value)
    }

    return (
        <div className='flex items-center gap-4 rounded-t-2xl border-b-2 border-b-slate-300 p-5 dark:border-b-slate-800'>
            <h1 className='select-none dark:text-white'>Type:</h1>
            {GlobalSearchFilters.map(item => (
                <div
                    key={item.value}
                    onClick={() => clickHandler(item.value)}
                    className={`cursor-pointer select-none rounded-3xl px-4 py-1 text-sm ${item.value === filterValue ? 'bg-primary-500 text-black' : 'background-light700_dark400 text-dark400_light700'}`}
                >
                    {item.name}
                </div>
            ))}
        </div>
    )
}

export default GlobalFilters