
import Question from '@/components/forms/Question'
import { getQuestionById } from '@/lib/actions/question.action'
import { getUserById } from '@/lib/actions/user.action'
import { URLProps } from '@/types'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

const Page = async ({ params }: URLProps) => {
    const { userId } = auth()


    const question = await getQuestionById({ questionId: params.id })

    if (question.author.clerkId !== userId) redirect('/not-found')


    const mongoUser = await getUserById({ userId: userId! })

    return (
        <div>
            <h1 className='h1-bold text-dark100_light900'>Ask a question</h1>

            <div className='mt-9'>
                <Question
                    mongoUserId={JSON.stringify(mongoUser._id)}
                    type='edit'
                    params={params}
                    currentValues={{
                        title: question.title,
                        explanation: question.content,
                        tags: question.tags.map((tag: any) => tag.name)
                     }}
                />
            </div>
        </div>
    )
}

export default Page