"use client"

import { Badge } from '@/components/ui/badge'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

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
    const [open, setOpen] = useState(false)

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
            {open && (<div className="absolute inset-0 z-[50] h-[100vh]  w-[100vw] bg-transparent" />)}
            {spread && <div className='mt-4 flex gap-3'>
                {filters.map(item => (
                    <Badge
                        className={`subtle-regular background-light700_dark300 text-light400_light500 rounded-md border-none px-4 py-2 max-md:hidden ${item.value === filterValue && 'bg-primary-500 text-black'}`}
                        onClick={() => setFilterValue(filterValue === item.value ? '' : item.value)}
                        key={item.value}>
                        {item.name}
                    </Badge>))}
            </div>}

            <Select onOpenChange={() => setOpen(prev => !prev)} onValueChange={(value) => setFilterValue(filterValue === value ? '' : value)}>
                <SelectTrigger className={`h-14 w-[180px] border-none bg-light-750 outline-none dark:bg-dark-300 dark:text-white max-sm:w-full ${spread && 'md:hidden'}`}>
                    <SelectValue placeholder="Select a filter" />
                </SelectTrigger>
                <SelectContent className=' border-solid border-gray-200 bg-light-800 dark:border-gray-900 dark:bg-dark-500 dark:text-white dark:shadow-dark-100'>
                    <SelectGroup>
                        <SelectItem className='px-8 py-4' key={'none'} value={'none'}>Select a filter</SelectItem>
                        {filters.map(item => (
                            <SelectItem
                                className='px-8 py-4'
                                key={item.value}
                                value={item.value}>
                                {item.name}
                            </SelectItem>))}
                    </SelectGroup>
                </SelectContent>
                {open && (<div onClick={e => e.stopPropagation()} className="absolute inset-0 z-[2000] h-[100vh]  w-[100vw] bg-transparent" />)}
            </Select>
        </>
    )
}

export default Filters