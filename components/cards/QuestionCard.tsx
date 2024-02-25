import React from 'react'
import RenderTag from '../shared/navbar/RenderTag'
import Image from 'next/image'
import { formatAndDivideNumber, getTimestamp } from '@/lib/utils'
// add interface for props

interface customProps {
    key: number
    _id: number
    title: string
    tags: { _id: number, name: string }[]
    author: {
        _id: string
        name: string
        picture: string
    }
    upvotes: number
    views: number
    answers: number
    createdAt: Date
}

const QuestionCard = ({
    _id,
    title,
    tags,
    author,
    upvotes,
    views,
    answers,
    createdAt,
}: customProps) => {
    return (
        <div className='card-shadow rounded-lg p-8'>
            <h3 className='h3-bold mb-4'>{title}</h3>
            <div className='flex gap-3'>
                {tags.map(tag => (
                    <RenderTag key={tag._id}>{tag.name}</RenderTag>
                ))}
            </div>


            <div className='mt-5 flex flex-wrap justify-between gap-5'>
                <div className='flex flex-wrap items-center gap-2'>
                    <div id='user' className='flex items-center gap-1'>
                        <Image src='/assets/icons/account.svg' alt='pfp' width={15} height={15} className='invert-colors' />
                        <h4>{author.name}</h4>
                    </div>
                    <div id='ask-date' className='small-regular'> - asked {getTimestamp(createdAt)}</div>
                </div>

                <div className='flex flex-wrap gap-3'>
                    <div className='flex items-center gap-1'>
                        <Image src='/assets/icons/like.svg' width={15} height={15} alt='' className='invert-colors' />
                        <h4 className='small-regular'>{formatAndDivideNumber(upvotes)} Votes</h4>
                    </div>
                    <div className='flex items-center gap-1'>
                        <Image src='/assets/icons/message.svg' width={15} height={15} alt='' className='invert-colors' />
                        <h4 className='small-regular'>{formatAndDivideNumber(answers)} Answers</h4>
                    </div>
                    <div className='flex items-center gap-1'>
                        <Image src='/assets/icons/eye.svg' width={15} height={15} alt='' className='invert-colors' />
                        <h4 className='small-regular'>{formatAndDivideNumber(views)} Views</h4>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionCard