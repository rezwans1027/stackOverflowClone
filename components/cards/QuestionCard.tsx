import React from 'react'
import RenderTag from '../shared/navbar/RenderTag'
import Image from 'next/image'
import { formatAndDivideNumber, getTimestamp } from '@/lib/utils'
import Link from 'next/link'
// add interface for props

interface customProps {
    key: number
    _id: number
    title: string
    tags: { _id: string, name: string }[]
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
        <div className='card-shadow card-wrapper rounded-lg p-8'>
            <Link href={`/question/${_id}`}>
                <h3 className='h3-bold text-dark200_light900 mb-4'>{title}</h3>
            </Link>
            <div className='flex gap-3'>
                {tags.map(tag => (
                    <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
                ))}
            </div>


            <div className='mt-5 flex flex-wrap justify-between gap-5'>
                <div className='flex flex-wrap items-center gap-2'>
                    <div id='user' className='flex items-center gap-1'>
                        <Image src={author.picture} alt='pfp' width={15} height={15} className='rounded-2xl' />
                        <h4 className='text-dark200_light900'>{author.name}</h4>
                    </div>
                    <div id='ask-date' className='small-regular text-dark200_light900'> - asked {getTimestamp(createdAt)}</div>
                </div>

                <div className='flex flex-wrap gap-3'>
                    <div className='flex items-center gap-1'>
                        <Image src='/assets/icons/like.svg' width={15} height={15} alt='' className='invert-colors' />
                        <h4 className='small-regular text-dark200_light900'>{formatAndDivideNumber(upvotes)} Votes</h4>
                    </div>
                    <div className='flex items-center gap-1'>
                        <Image src='/assets/icons/message.svg' width={15} height={15} alt='' className='invert-colors' />
                        <h4 className='small-regular text-dark200_light900'>{formatAndDivideNumber(answers)} Answers</h4>
                    </div>
                    <div className='flex items-center gap-1'>
                        <Image src='/assets/icons/eye.svg' width={15} height={15} alt='' className='invert-colors' />
                        <h4 className='small-regular text-dark200_light900'>{formatAndDivideNumber(views)} Views</h4>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionCard