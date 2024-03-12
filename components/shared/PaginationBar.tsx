"use client"
import React from 'react'
import { Pagination, PaginationContent, PaginationItem } from '../ui/pagination'
import Link from 'next/link'
import { addSearchParams } from '@/lib/utils'

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
    });
}

const PaginationBar = ({ searchParams, totalPages }:any) => {

    return (
        <div >
            <Pagination className='mt-4'>
    <PaginationContent className='dark:text-white'>
        <PaginationItem className='background-light750_dark300 mr-4 rounded-md px-3 py-1'>
            <Link href={parseInt(searchParams.page || '1') > 1 ? addSearchParams(searchParams, { page: parseInt(searchParams.page) - 1 }) : '#'}>
                <span className={parseInt(searchParams.page || '1') === 1 ? 'cursor-not-allowed text-gray-400' : undefined} onClick={scrollToTop}>
                    prev
                </span>
            </Link>
        </PaginationItem>
        {[parseInt(searchParams.page || '1') - 1, parseInt(searchParams.page || '1'), parseInt(searchParams.page || '1') + 1].map((pageNumber) => (
            pageNumber > 0 && pageNumber <= totalPages && (
                <PaginationItem key={pageNumber} className={parseInt(searchParams.page || '1') === pageNumber ? ' mx-3 size-8 cursor-not-allowed rounded bg-primary-500 pt-[3.9px]  text-center font-bold text-white' : undefined} >
                    <Link className='mr-[1.2px]' href={addSearchParams(searchParams, { page: pageNumber.toString() })}>
                        <span className={parseInt(searchParams.page || '1') === pageNumber ? 'cursor-not-allowed font-bold ' : undefined} onClick={scrollToTop}>
                            {pageNumber}
                        </span>
                    </Link>
                </PaginationItem>
            )
        ))}
        <PaginationItem className='background-light750_dark300 ml-4 rounded-md px-3 py-1'>
            <Link href={parseInt(searchParams.page || '1') < totalPages ? addSearchParams(searchParams, { page: parseInt(searchParams.page || '1') + 1 }) : '#'}>
                <span className={parseInt(searchParams.page || '1') === totalPages ? 'cursor-not-allowed text-gray-400' : undefined} onClick={scrollToTop}>
                    next
                </span>
            </Link>
        </PaginationItem>
    </PaginationContent>
</Pagination>

        </div>
    )
}

export default PaginationBar
