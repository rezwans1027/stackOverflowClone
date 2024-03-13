"use client"

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import GlobalFilters from './GlobalFilters'
import { getGlobalResults } from '@/lib/actions/global.action'

interface GlobalResultProps {
    openSetter: React.Dispatch<React.SetStateAction<boolean>>
    valueSetter: React.Dispatch<React.SetStateAction<string>>
    pathname: string
}
interface SearchResult {
    name: any; // Consider specifying a more precise type if possible
    id: any;   // Consider specifying a more precise type if possible
    type: string;
  }

const GlobalResult = ({ openSetter, valueSetter, pathname }: GlobalResultProps) => {
    const searchParams = useSearchParams();
    const componentRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<SearchResult[]>([])

    const global = searchParams.get('global') || '';
    const type = searchParams.get('type') || '';

    useEffect(() => {
        const fetchResult = async () => {
            setResult([])
            setIsLoading(true)

            try {
                const result = await getGlobalResults({ query: global, type })
                setResult(result)

            } catch (error) {
                console.log(error)
                throw error
            } finally {
                setIsLoading(false)
            }
        }
        fetchResult()
    }, [global, type])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                openSetter(false)
                valueSetter('')
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [componentRef, openSetter, valueSetter]);

    console.log(result)

    const renderLink = (type: string, id: string) => {
        switch (type) {
            case 'Question':
                return `/question/${id}`
            case 'Answer':
                return `/question/${id}`
            case 'User':
                return `/profile/${id}`
            case 'Tag':
                return `/tags/${id}`
            default:
                return '/'
        }
    }

    return (
        <div ref={componentRef} className=' background-light750_dark300 absolute top-16 w-full rounded-2xl shadow-xl'>
            <GlobalFilters />

            <h1 className='py-4 pl-5 text-xl font-bold dark:text-white'>Top Match</h1>
            {isLoading ?
                (<div className='flex-center mb-6 flex-col px-5'>
                    <ReloadIcon className='my-2 mb-6 size-10 animate-spin text-primary-500' />
                    <p className='text-dark200_light800 body-regular'>Browsing the entire database</p>
                </div>)
                : <div className='mb-6'>
                    {result.length > 0 ?
                        <div>
                            {result.map((item: any, index: number) => (
                                <Link key={item.id + item.type + index} href={renderLink(item.type, item.id)} className='flex w-full p-1 py-3 hover:bg-light-700/50 dark:hover:bg-dark-500/50'>
                                    <Image src='/assets/icons/tag.svg' className='invert-colors ml-4 mr-3' width={24} height={24} alt='tag' />
                                    <div>
                                        <h1 className='paragraph-semibold line-clamp pb-1 dark:text-white'>{item.name}</h1>
                                        <h1 className='body-semibold text-dark400_light500'>{item.type}</h1>
                                    </div>

                                </Link>
                            ))}
                        </div>
                        : <p className='text-dark200_light800 body-regular px-5 py-2.5 text-center'>No result found</p>}

                </div>}
        </div>
    )
}

export default GlobalResult