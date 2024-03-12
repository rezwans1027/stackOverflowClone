"use client"

import { Badge } from '@/components/ui/badge'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import CustomSelect from './CustomSelect'

interface Props {
    filters: {
        name: string,
        value: string,
    }[]
    otherClasses?: string
    containerClasses?: string
    spread?: boolean
}

const Filters = ({ filters, spread }: Props) => {
    const router = useRouter();
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const [filterValue, setFilterValue] = useState(searchParams.get('filter') || '')


    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        const currentFilter = params.get('filter') || '';
    
        if (filterValue !== currentFilter) {
            if (filterValue && filterValue !== 'none') {
                params.set('filter', filterValue);
            } else {
                params.delete('filter');
            }
    
            params.delete('page');
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            
        }
    }, [searchParams, pathname, router, filterValue]);

    return (
        <>
            {spread && <div className='mt-4 flex gap-3'>
                {filters.map(item => (
                    <Badge
                        className={`subtle-regular background-light700_dark300 text-light400_light500 rounded-md border-none px-4 py-2 max-md:hidden ${item.value === filterValue && 'bg-primary-500 text-black'}`}
                        onClick={() => setFilterValue(filterValue === item.value ? '' : item.value)}
                        key={item.value}>
                        {item.name}
                    </Badge>))}
            </div>}

            <CustomSelect extraClasses={spread && 'md:hidden'} filters={filters} onValueChange={(value:any) => setFilterValue(filterValue === value ? '' : value)} />

        </>
    )
}

export default Filters