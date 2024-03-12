"use client"
import React from 'react'
import { usePathname } from 'next/navigation'
import { sidebarLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import { SignedIn, SignedOut, SignOutButton, useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'


const LeftSidebar = () => {
    const pathname = usePathname()
    const { userId } = useAuth();

    return (
        <div className='background-light900_dark200 sticky left-0 top-0 flex h-[100vh] w-64 min-w-64 flex-col justify-between 
        p-4 pt-32 text-3xl shadow-light-300 dark:shadow-none max-lg:w-20 max-lg:min-w-20 max-sm:hidden'>
            <div className='flex flex-col gap-2 '>
                {sidebarLinks.map(item => {
                    const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;

                    return (
                        <div key={item.label}>
                            <Link href={item.route} className={`flex items-center gap-4 rounded-lg p-4 
                        ${isActive && 'bg-primary-500 font-bold text-white'} max-lg:p-[0.9rem]`}>
                                <Image src={item.imgURL} width={20} height={20} alt='link' className='invert-colors' />
                                <p className='text-xl dark:text-white max-lg:hidden'>{item.label}</p>
                            </Link>
                        </div>
                    )
                })}
                <SignedIn>
                    <div >
                        <Link href={`/profile/${userId}`} className={`flex items-center gap-4 rounded-lg p-4 
                        ${userId && pathname.includes(userId) && 'bg-primary-500 font-bold text-white'} max-lg:p-[0.9rem]`}>
                            <Image src={'/assets/icons/user.svg'} width={20} height={20} alt='link' className='invert-colors' />
                            <p className='text-xl dark:text-white max-lg:hidden'>{'Profile'}</p>
                        </Link>
                    </div>
                </SignedIn>
            </div>
            <div>
                <SignedIn>
                    <SignOutButton >
                        <div className='flex gap-3 p-4'>
                            <Image src='/assets/icons/close.svg' height={20} width={20} alt='' className='' />
                            <p className='text-xl dark:text-white max-lg:hidden'>Logout</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
                <SignedOut>
                    <div className='flex flex-col gap-2'>
                        <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/sign-in/?redirect_url=${pathname}`}>
                            <Button className='small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
                                <Image src='/assets/icons/account.svg' height={20} width={20} alt='log-in' className='invert-colors lg:hidden' />
                                <span className='primary-text-gradient text-lg max-lg:hidden'>Log In</span>
                            </Button>
                        </Link>
                        <Link href={`${process.env.NEXT_PUBLIC_SERVER_URL}/sign-up/?redirect_url=${pathname}`}>
                            <Button className='small-medium light-border-2 btn-tertiary text-dark400_light900 
                            min-h-[41px] w-full rounded-lg px-4 py-3 text-lg shadow-none'>
                                <Image src='/assets/icons/sign-up.svg' height={20} width={20} alt='sign-up' className='invert-colors lg:hidden' />
                                <p className='max-lg:hidden'>Sign Up</p>
                            </Button>
                        </Link>
                    </div>
                </SignedOut>
            </div>
        </div >
    )
}

export default LeftSidebar