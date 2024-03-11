"use client"

import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import GlobalResult from './GlobalResult'

const GlobalSearch = () => {
    const router = useRouter();
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const [inputValue, setInputValue] = useState(searchParams.get('search') || '')
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const debounce = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            const currentValue = searchParams.get('global') || '';

            if (currentValue !== inputValue) {

                if (inputValue) {
                    params.set('global', inputValue);
                } else {
                    params.delete('global');
                    params.delete('type');
                }
                params.delete('page');
                router.replace(pathname + `?${params.toString()}`, { scroll: false })

            };
        }, 350)

        return () => clearTimeout(debounce)

    }, [searchParams, pathname, router, setInputValue, inputValue])

    useEffect(() => {
        setIsOpen(false)
        setInputValue('')
    }, [pathname])

    return (
        <div className='relative w-full max-w-[600px] max-lg:hidden'>
            <div className='background-light750_dark300 relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4'>
                <Image
                    src={'/assets/icons/search.svg'}
                    width={24}
                    height={24}
                    alt='search'
                    className='cursor-pointer'
                />
                <Input type='text' placeholder='Search'
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value)
                        if (!isOpen) setIsOpen(true)
                        if (e.target.value === '' && isOpen) setIsOpen(false)
                    }}
                    className='text-dark400_light700 paragraph-regular no-focus placeholder background-light750_dark300 border-none shadow-none outline-none' />
            </div>

            {isOpen && <GlobalResult pathname={pathname} openSetter={setIsOpen} valueSetter={setInputValue} />}
        </div>
    )
}

export default GlobalSearch