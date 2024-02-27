import { getQuestionById } from '@/lib/actions/question.action';
import React from 'react'

const Page = async ({ params }: { params: { id: string } }) => {

    const result = await getQuestionById({ questionId: params.id });

    return (
        <div>
            {result.title}
            {result.author.name}
        </div>
    )
}

export default Page