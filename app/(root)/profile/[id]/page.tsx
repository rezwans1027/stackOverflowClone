import QuestionCard from '@/components/cards/QuestionCard'
import Stats from '@/components/shared/Stats'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserQuestions } from '@/lib/actions/question.action'
import { getUserInfo } from '@/lib/actions/user.action'
import { getMonthAndYear } from '@/lib/utils'
import { auth } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import PaginationBar from '@/components/shared/PaginationBar'


const page = async ({ params, searchParams }: any) => {

    console.log(searchParams)

    const { userId } = auth()
    const { user, totalQuestions, totalAnswers } = await getUserInfo({ userId: params.id }) as { user: any; totalQuestions: number; totalAnswers: number }

    const { questions, totalPages } = await getUserQuestions({ userId: user._id, page: searchParams.page || 1 , pageSize: 5 }) as { questions: any[]; totalPages: number }

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
                    <Button className="background-light750_dark300 min-h-[46px] px-6 py-3 dark:text-white  ">Edit Profile</Button>
                </div>}


            </div>

            <div className='mb-10'>
                <h1 className='h3-bold my-6 dark:text-white'>Stats</h1>
                <Stats answers={totalAnswers} questions={totalQuestions} />
            </div>

            <Tabs defaultValue="account" className="mt-4">
                <TabsList className='background-light700_dark300 text-dark300_light700 px-1 py-5'>
                    <TabsTrigger
                        className='rounded-sm px-2 data-[state=active]:bg-primary-100 data-[state=active]:text-primary-500 dark:data-[state=active]:bg-dark-500 ' value="account">Top Posts</TabsTrigger>
                    <TabsTrigger className='rounded-sm px-2 data-[state=active]:bg-primary-100 data-[state=active]:text-primary-500 dark:data-[state=active]:bg-dark-500 ' value="password">Answers</TabsTrigger>
                </TabsList>
                <TabsContent value="account" >
                    <div className='mt-8'>
                        <div className='flex flex-col gap-6'>
                            {questions && questions.map((question: any) => (
                                <QuestionCard
                                    key={question._id}
                                    _id={question._id}
                                    title={question.title}
                                    tags={question.tags}
                                    author={question.author}
                                    upvotes={question.upvotes}
                                    views={question.views}
                                    answers={question.answers}
                                    createdAt={question.createdAt}
                                />
                            ))}

                            <PaginationBar searchParams={searchParams} totalPages={totalPages} />

                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="password">Change your password here.</TabsContent>
            </Tabs>

        </div>
    )
}

export default page