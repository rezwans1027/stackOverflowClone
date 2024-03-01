import { Button } from '@/components/ui/button'
import { getUserById } from '@/lib/actions/user.action'
import { getMonthAndYear } from '@/lib/utils'
import { auth } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = async ({ params }: any) => {

    const { userId } = auth()
    const user = await getUserById({ userId: params.id })
    console.log(user.clerkId, params.id)

    return (
        <div>
            <div className='flex justify-between gap-4 max-sm:flex-col-reverse'>
                <div className='flex max-lg:flex-col lg:items-start'>
                    <Image src={user.picture} width={140} height={140} alt='user' className='mb-4 mr-4 size-36 rounded-full object-cover' />

                    <div>
                        <h2 className='h2-bold dark:text-white '>{user.name}</h2>
                        <h4 className='dark:text-white'>@{user.username}</h4>

                        <div className='mt-4 flex flex-wrap items-center gap-3'>
                            {user.porfolioWebsite && <div className='flex items-center gap-1'>
                                <Image src='/assets/icons/link.svg' width={20} height={20} alt='link' />
                                <Link href='https://rezwansheikh.com' className='text-blue-500'>{user.portfolioWebsite}</Link>
                            </div>}
                            {user.location && <div className='flex gap-1'>
                                <Image src='/assets/icons/location.svg' width={20} height={20} alt='location' />
                                <div className='dark:text-white'>{user.location}</div>
                            </div>}
                            <div className='flex items-center gap-1'>
                                <Image src='/assets/icons/calendar.svg' width={20} height={20} alt='calendar' />
                                <div className='dark:text-white'>Joined {getMonthAndYear(user.joinedAt)}</div>
                            </div>
                        </div>
                        <h3 className='mt-5 dark:text-white'>{user.bio}</h3>
                    </div>



                </div>




                {userId === params.id && <div className='ml-auto'>
                    <Button className="background-light750_dark300 min-h-[46px] px-4 py-3 dark:text-white  ">Edit Profile</Button>
                </div>}


            </div>

            STATS

        </div>
    )
}

export default page