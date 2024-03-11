"use client"

import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface CustomInputProps {
    route: string
    iconPosition: string
    imgSrc: string
    placeholder: string
    otherClasses: string
}

const LocalSearchBar = ({
    route,
    iconPosition,
    imgSrc,
    placeholder,
    otherClasses,
}: CustomInputProps) => {

    const router = useRouter();
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const [inputValue, setInputValue] = useState(searchParams.get('search') || '')

    useEffect(() => {
        const debounce = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            const currentValue = searchParams.get('search') || '';

            if (currentValue !== inputValue) {

                if (inputValue) {
                    params.set('search', inputValue);
                } else {
                    params.delete('search');
                }
                params.delete('page');
                router.replace(pathname + `?${params.toString()}`)

            };

        }, 350)

        return () => clearTimeout(debounce)

    }, [searchParams, pathname, router, setInputValue, inputValue])

    const handleInputChange = (e: any) => {
        const value = e.target.value;
        setInputValue(value);

    };

    return (
        <div className={`background-light750_dark300  flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}>

            {iconPosition === 'left' && (<Image
                src={imgSrc}
                alt='search icon'
                width={20}
                height={20}
                className='cursor-pointer'
            />)}
            <Input
                type='text'
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => handleInputChange(e)}
                className='text-dark400_light700 paragraph-regular no-focus placeholder background-light750_dark300 border-none shadow-none outline-none'
            />
        </div>
    )
}

export default LocalSearchBar