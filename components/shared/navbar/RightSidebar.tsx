import Image from 'next/image'
import React from 'react'
import RenderTag from '../RenderTag'
import { getTopQuestions } from '@/lib/actions/question.action'
import Link from 'next/link'
import { getPopularTags } from '@/lib/actions/tag.actions'

const RightSidebar = async () => {

    const questions = await getTopQuestions()
    const tags = await getPopularTags()

    return (
        <div className='background-light900_dark200 sticky right-0 top-0 z-40 h-[100vh] w-96 min-w-96 p-6 shadow-xl dark:shadow-none max-xl:hidden'>

            <div className='mt-28 dark:text-white'>
                <h3 className='h3-bold'>Top Questions</h3>
                <div className='mt-8 flex flex-col gap-6'>
                    {
                        questions?.map((question: any) => {
                            return (
                                <Link key={question._id} href={`/question/${question._id}`} className='flex items-center justify-between'>
                                    <div className='flex w-full items-center justify-between'>
                                        <p className='body-medium text-dark500_light700'>{question.title}</p>
                                        <Image src='/assets/icons/chevron-right.svg' width={20} height={20} alt='arrow' className='invert-colors' />
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>

            <div>
                <h3 className='h3-bold mt-20 dark:text-white'>Popular Tags</h3>

                <div className='mt-8 flex flex-col gap-4'>
                    {tags?.map((tag: any) => {
                        return (
                            <div key={tag._id} className='flex items-center justify-between'>
                                <RenderTag _id={tag._id} name={tag.name} />
                                <p className='small-medium text-dark500_light700'>{tag.questionsCount}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default RightSidebar