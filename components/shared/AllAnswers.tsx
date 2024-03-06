import React from 'react'
import Filters from './Filters'
import { AnswerFilters } from '@/constants/filters'
import { getAnswersByQuestionId } from '@/lib/actions/answer.action'
import Image from 'next/image'
import Link from 'next/link'
import { getTimestamp } from '@/lib/utils'
import ParseHTML from './ParseHTML'
import Votes from './Votes'
import { auth } from '@clerk/nextjs'
import { getUserById } from '@/lib/actions/user.action'

interface props {
    questionId: string
    totalAnswers: number
    page?: number
    filter?: string
}


const AllAnswers = async ({ questionId, totalAnswers, filter }: props) => {

    const { userId } = auth()

    const mongoUser = await getUserById({ userId: userId! })

    console.log('filter', filter)

    const result = await getAnswersByQuestionId({ questionId, sortBy: filter })

    return (
        <div className='mt-11'>
            <div className='flex items-center justify-between max-sm:flex-col-reverse max-sm:items-start'>
                <h3 className='primary-text-gradient'>{totalAnswers} Answers</h3>

                <Filters filters={AnswerFilters} />
            </div>
            {result?.answers.map((answer: any) => (
                <article key={answer._id} className='light-border border-b py-10 ' >
                    <div className='flex items-center justify-between'>
                        <div className='mb-8 flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
                            <Link href={`/profile/${answer.author.clerkId}`} className='flex items-start gap-1 sm:items-center'>
                                <Image src={answer.author.picture} alt='pfp' width={18} height={18} className='rounded-full object-cover max-sm:mt-0.5' />
                                <div className='flex flex-col sm:flex-row sm:items-center' >
                                    <p className='body-semibold text-dark300_light700 '>{answer.author.name}</p>

                                    <p className='small-regular text-light400_light500 ml-2 mt-0.5 line-clamp-1'>
                                        <span className='max-sm:hidden'>
                                            answered {" "} {getTimestamp(answer.createdAt)}
                                        </span>
                                    </p>
                                </div>
                            </Link>

                            <div className='flex justify-end '>
                            <Votes
                            type={"answer"}
                            itemId={answer._id.toString()}
                            userId={mongoUser?._id.toString()}
                            upvotes={answer.upvotes.length}
                            downvotes={answer.downvotes.length}
                            hasUpvoted={answer.upvotes.includes(mongoUser?._id.toString())}
                            hasDownvoted={answer.downvotes.includes(mongoUser?._id.toString())}

                        />
                            </div>
                        </div>
                    </div>
                    <div className='flex w-full break-words'>
                        <ParseHTML data={answer.content} />
                    </div>
                </article>
            ))}

        </div>
    )
}

export default AllAnswers