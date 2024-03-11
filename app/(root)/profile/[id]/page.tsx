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
import { getUserAnswers } from '@/lib/actions/answer.action'
import AnswerCard from '@/components/cards/AnswerCard'


const page = async ({ params, searchParams }: any) => {

    const { userId } = auth()
    const { user, totalQuestions, totalAnswers, badgeCounts } = await getUserInfo({ userId: params.id }) as { user: any; totalQuestions: number; totalAnswers: number, badgeCounts: any }

    const { questions, totalPages } = await getUserQuestions({ userId: user._id, page: searchParams.page || 1, pageSize: 5 }) as { questions: any[]; totalPages: number }

    const { answers, totalAnswerPages } = await getUserAnswers({ userId: user._id, page: searchParams.page || 1, pageSize: 5 }) as { answers: any[]; totalAnswerPages: number }


    return (
        <div>
            <div className='flex justify-between gap-4 max-sm:flex-col-reverse'>
                <div className='flex max-lg:flex-col lg:items-start'>
                    <Image src={user.picture} width={140} height={140} alt='user' className='mb-4 mr-4 size-36 rounded-full object-cover' />

                    <div>
                        <h2 className='h2-bold dark:text-white '>{user.name}</h2>
                        <h4 className='dark:text-white'>@{user.username}</h4>

                        <div className='mt-4 flex flex-wrap items-center gap-3'>
                            {user.portfolioWebsite &&
                                <div className='flex w-fit items-center gap-1'>
                                    <Image src='/assets/icons/link.svg' width={20} height={20} alt='link' className='flex w-fit' />
                                    <Link href={user.portfolioWebsite} className='w-full text-blue-500'>
                                        <p className='line-clamp w-full'>
                                            {user.portfolioWebsite}
                                        </p>
                                    </Link>
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
                        <h3 className='mt-5 dark:text-white xl:hidden'>{user.bio}</h3>
                    </div>
                    <h3></h3>
                </div>
                


                {userId === params.id && <div className='ml-auto'>
                    <Link href={`${params.id}/edit`}>
                        <Button className="background-light750_dark300 min-h-[46px] px-6 py-3 dark:text-white  ">Edit Profile</Button>
                    </Link>
                </div>}


            </div>
            <h3 className='mt-5 dark:text-white max-xl:hidden'>{user.bio}</h3>

            <div className='mb-10'>
                <h1 className='h3-bold my-6 dark:text-white'>Stats</h1>
                <Stats answers={totalAnswers} questions={totalQuestions} badgeCounts={badgeCounts} />
            </div>

            <Tabs defaultValue="account" className="mt-4">
                <TabsList className='background-light700_dark300 text-dark300_light700 px-1 py-5'>
                    <Link href={`${user.clerkId}`} >
                        <TabsTrigger
                            className='rounded-sm px-2 data-[state=active]:bg-primary-100 data-[state=active]:text-primary-500 dark:data-[state=active]:bg-dark-500 ' value="account">Top Posts</TabsTrigger>
                    </Link>
                    <Link href={`${user.clerkId}`} >
                        <TabsTrigger className='rounded-sm px-2 data-[state=active]:bg-primary-100 data-[state=active]:text-primary-500 dark:data-[state=active]:bg-dark-500 ' value="password">Answers</TabsTrigger>
                    </Link>

                </TabsList>
                <TabsContent value="account" >
                    <div className='mt-8'>
                        {questions.length ? <div className='flex flex-col gap-6'>
                            {questions.map((question: any) => (
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
                                    showEdit={userId === params.id}
                                />
                            ))}

                            <PaginationBar searchParams={searchParams} totalPages={totalPages} />

                        </div> : <p className='text-dark300_light700'></p>}
                    </div>
                </TabsContent>
                <TabsContent value="password">
                    <div className='mt-8'>
                        {answers.length ? <div className='flex flex-col gap-6'>
                            {answers.map((answer: any) => (
                                <AnswerCard
                                    key={answer._id}
                                    _id={answer._id}
                                    title={answer.question.title}
                                    author={answer.author}
                                    upvotes={answer.upvotes}
                                    question={answer.question}
                                    createdAt={answer.createdAt}
                                    showDelete={userId === params.id}
                                />
                            ))}
                            <PaginationBar searchParams={searchParams} totalPages={totalAnswerPages} />

                        </div> : <p className='text-dark300_light700'></p>}
                    </div>
                </TabsContent>
            </Tabs>

        </div>
    )
}

export default page