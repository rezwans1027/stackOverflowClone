import { Badge } from '@/components/ui/badge'
import React from 'react'

import {
    Select,
    SelectContent,
    SelectGroup,
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
    spread?: boolean
}

const Filters = ({ filters, spread }: Props) => {
    return (
        <>
            {spread && <div className='mt-4 flex gap-3'>
                {filters.map(item => (<Badge className='subtle-regular background-light700_dark300 text-light400_light500 rounded-md border-none px-4 py-2 max-md:hidden' key={item.value}>{item.name}</Badge>))}
            </div>}

            <Select>
                <SelectTrigger className={`h-14 w-[180px] border-none bg-light-750 outline-none dark:bg-dark-300 dark:text-white max-sm:w-full ${spread && 'md:hidden'}`}>
                    <SelectValue placeholder="Select a filter" />
                </SelectTrigger>
                <SelectContent className='z-50 border-solid border-gray-200 bg-light-800 dark:border-gray-900 dark:bg-dark-500 dark:text-white dark:shadow-dark-100'>
                    <SelectGroup>
                        {filters.map(item => (<SelectItem className='px-8 py-4' key={item.value} value={item.value}>{item.name}</SelectItem>))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </>
    )
}

export default Filters