import { Badge } from '@/components/ui/badge'
import React from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Props {
    filters: {
        name: string,
        value: string,
    }[]
    otherClasses?: string
    containerClasses?: string
}

const Filters = ({ filters }: Props) => {
    return (
        <>
            <div className='mt-4 flex gap-3'>
                {filters.map(item => (<Badge className='subtle-regular background-light700_dark300 text-light400_light500 rounded-md border-none px-4 py-2 max-md:hidden' key={item.value}>{item.name}</Badge>))}
            </div>

            <Select>
                <SelectTrigger className="h-14 w-[180px] border-none bg-light-800 outline-none dark:bg-dark-300 dark:text-white max-sm:w-full md:hidden">
                    <SelectValue placeholder="Select a filter" />
                </SelectTrigger>
                <SelectContent className='card-wrapper border-none bg-white dark:text-white'>
                    {filters.map(item => (<SelectItem className='p-4' key={item.value} value={item.value}>{item.name}</SelectItem>))}
                </SelectContent>
            </Select>
        </>
    )
}

export default Filters