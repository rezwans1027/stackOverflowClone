"use client"

import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetClose,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'
import { SignedIn, SignedOut, useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { sidebarLinks } from '@/constants'
import { usePathname } from 'next/navigation'

const NavContent = () => {

    const { userId } = useAuth();

    const pathname = usePathname()
    return (
        <section className='flex h-full flex-col gap-4 pb-4 pt-6'>
            {sidebarLinks.map(item => {
                const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;
                return (
                    <Link href={item.route}
                        key={item.label}
                    >
                        <SheetClose key={item.route} className={`${isActive ? 'primary-gradient rounded-lg text-light-900' : 'text-dark200_light900'} flex w-full items-center justify-start gap-3 bg-transparent p-2`}>
                            <Image src={item.imgURL} alt={item.label} width={20} height={20} className={`${!isActive && 'invert-colors'}`} />
                            <p className={`${isActive ? 'base-bold' : 'base-medium'}`} >{item.label}</p>
                        </SheetClose>
                    </Link>
                )
            })}
            <SignedIn>
                <Link href={`/profile/${userId}`} >
                    <SheetClose className={`${userId && pathname.includes(userId) ? 'primary-gradient rounded-lg text-light-900' : 'text-dark200_light900'} flex w-full items-center justify-start gap-3 bg-transparent p-2`} >
                        <Image src={'/assets/icons/user.svg'} width={20} height={20} alt='link' className='invert-colors' />
                        <p className={`${userId && pathname.includes(userId) ? 'base-bold' : 'base-medium'}`} >Profile</p>
                    </SheetClose>
                </Link>
            </SignedIn>
        </section>
    )
}

const MobileNav = () => {
    return (
        <Sheet>
            <SheetTrigger asChild className=' sm:hidden'>
                <div>
                    <Image src='/assets/icons/hamburger.svg' width={36} height={36} alt='Menu' className='invert-colors' />
                </div>
            </SheetTrigger>
            <SheetContent className='background-light900_dark200 border-none' side='left' >
                <Link href='/' className='flex items-center gap-1'>

                    <Image src='/assets/images/site-logo.svg'
                        width={20} height={20} alt='DevFlow' />
                    <p className='h3-bold font-spaceGrotesk text-dark-100 dark:text-light-900'>Dev<span className='text-primary-500'>OverFlow</span></p>

                </Link>
                <div >
                    <NavContent />

                    <SignedOut>
                        <div className='flex flex-col gap-3'>
                            <SheetClose>
                                <Link href='sign-in'>
                                    <Button className='small-medium btn-secondary min-h-[35px] w-full rounded-lg px-4 py-2 shadow-none'>
                                        <span className='primary-text-gradient'>Log In</span>
                                    </Button>
                                </Link>
                            </SheetClose>
                            <SheetClose>
                                <Link href='sign-up'>
                                    <Button className='small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[35px] w-full rounded-lg px-4 py-2 shadow-none'>
                                        Sign Up
                                    </Button>
                                </Link>
                            </SheetClose>
                        </div>
                    </SignedOut>
                </div>
            </SheetContent>
        </Sheet>

    )
}

export default MobileNav