import Answer from '@/components/forms/Answer';
import AllAnswers from '@/components/shared/AllAnswers';
import ParseHTML from '@/components/shared/ParseHTML';
import RenderTag from '@/components/shared/RenderTag';
import Votes from '@/components/shared/Votes';
import { getQuestionById } from '@/lib/actions/question.action';
import { getUserById } from '@/lib/actions/user.action';
import { formatAndDivideNumber, getTimestamp } from '@/lib/utils';
import { auth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Page = async ({ params, searchParams }: any) => {
    const result = await getQuestionById({ questionId: params.id });
    const { userId } = auth()

    const mongoUser = await getUserById({ userId: userId! })

    return (
        <div className=''>
            <div className="flex-start w-full flex-col ">
                <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                    <Link href={`/profile/${result.author.clerkId}`}
                        className="flex items-center justify-start gap-2"  >
                        <Image
                            src={result.author.picture}
                            className="rounded-full"
                            width={22}
                            height={22}
                            alt="profile"
                        />
                        <p className="paragraph-semibold text-dark300_light700">
                            {result.author.name}
                        </p>
                    </Link>
                    <div className="flex justify-end">
                        <Votes
                            type={"question"}
                            itemId={result._id.toString()}
                            userId={mongoUser?._id.toString()}
                            upvotes={result.upvotes.length}
                            downvotes={result.downvotes.length}
                            hasUpvoted={result.upvotes.includes(mongoUser?._id.toString())}
                            hasDownvoted={result.downvotes.includes(mongoUser?._id.toString())}
                            hasSaved={mongoUser?.saved.includes(result._id)}
                        />
                    </div>
                </div>
                <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
                    {result.title}
                </h2>
            </div>

            <div className="mb-8 mt-5 flex flex-wrap gap-4">
                <div className='flex flex-wrap items-center gap-1'>
                    <Image src="/assets/icons/clock.svg" alt='pfp' width={15} height={15} className='invert-colors' />
                    <div id='ask-date' className='small-regular text-dark200_light900'>asked {getTimestamp(result.createdAt)}</div>
                </div>
                <div className='flex items-center gap-1'>
                    <Image src='/assets/icons/message.svg' width={15} height={15} alt='' className='invert-colors' />
                    <h4 className='small-regular text-dark200_light900'>{formatAndDivideNumber(result.answers.length)} Answers</h4>
                </div>
                <div className='flex items-center gap-1'>
                    <Image src='/assets/icons/eye.svg' width={15} height={15} alt='' className='invert-colors' />
                    <h4 className='small-regular text-dark200_light900'>{formatAndDivideNumber(result.views)} Views</h4>
                </div>
            </div>
            <div className='flex w-full'>
                <ParseHTML data={result.content} />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
                {result.tags.map((tag: any) => (
                    <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
                ))}
            </div>

            <AllAnswers questionId={result._id} totalAnswers={result.answers.length} />

            <Answer mongoUserId={mongoUser?._id.toString()} questionId={result._id.toString()} />


        </div>
    )
}

export default Page