"use client"

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

interface Props {
    extraClasses?: any
    filters: {
        name: string,
        value: string,
    }[]
    onValueChange: (value: string) => void
}

const CustomSelect = ({ extraClasses, filters, onValueChange }: Props) => {
    const [value, setValue] = useState('none')
    const [triggerName, setTriggerName] = useState('Select A Filter')
    const [open, setOpen] = useState(false)
    const selectRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (open) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
        return undefined;
    }, [open]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // If the click is outside the selectRef element, close the select
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        // Add when the component is mounted
        document.addEventListener("mousedown", handleClickOutside);
        // Return a function to be called when the component is unmounted
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        onValueChange(value)
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        , [value,])

    return (
        <div className='relative' ref={selectRef}>
            <div id='select--trigger' onClick={() => setOpen(prev => !prev)}>
                <div className={`h-14 w-[180px] rounded-lg border-none bg-light-750 outline-none dark:bg-dark-300 dark:text-white max-sm:w-full ${extraClasses} flex items-center justify-between p-4`}>
                    <p className='paragraph-medium text-dark200_light900'>{triggerName}</p>
                    <Image className='select-none' src='/assets/icons/chevron-down.svg' width={20} height={20} alt='Arrow Down' />
                </div>
            </div>
            {
                open && (
                    <div className='body-regular absolute top-16 z-[1000] w-[180px] rounded-lg border-solid border-gray-300 bg-light-900 px-1 py-2 shadow-light-200 dark:border-gray-900 dark:bg-dark-500 dark:text-white dark:shadow-dark-100   max-sm:w-full'>
                        <div className='flex flex-col gap-2'>

                            <div
                                onClick={() => { setValue('none'); setTriggerName('Select A Filter'); setOpen(false) }}
                                className='select-none border-none px-4 py-2 hover:bg-slate-200 dark:hover:bg-gray-800 '>
                                Select A Filter
                            </div>
                            {filters?.map((item: any) => (
                                <div
                                    className='select-none border-none px-4 py-2 hover:bg-slate-200 dark:hover:bg-gray-800'
                                    onClick={() => { setValue(item.value); setTriggerName(item.name); setOpen(false) }}
                                    key={item.value}>
                                    {item.name}
                                </div>))}
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default CustomSelect