import React from 'react'
import Image from 'next/image'
import { formatAndDivideNumber, getTimestamp } from '@/lib/utils'
import Link from 'next/link'
import Confirmation from '../shared/Confirmation'

interface customProps {
    key: number
    _id: number
    title: string
    author: {
        _id: string
        name: string
        picture: string
    }
    upvotes: Array<object>
    question: { _id: string }
    createdAt: Date,
    showDelete?: boolean
}



const AnswerCard = ({
    _id,
    title,
    author,
    upvotes,
    question,
    createdAt,
    showDelete
}: customProps) => {
    return (
        <div className='card-wrapper rounded-lg p-8'>
            <div className='mb-4 flex items-center justify-between'>
                <Link href={`/question/${question._id}`}>
                    <p className='h3-bold text-dark200_light900 line-clamp mx-0 w-full px-0'>{title}</p>
                </Link>

                {showDelete && <div className='pl-4'>
                    <Confirmation
                    title="Are you sure you want to delete this answer?"
                    description="This action cannot be undone."
                    type="delete"
                    objectId={_id.toString()}
                    >
                        <Image src='/assets/icons/trash.svg' width={20} height={20} alt='delete' />
                    </Confirmation>
                </div>}

            </div>


            <div className='mt-5 flex flex-wrap justify-between gap-5'>
                <div className='flex flex-wrap items-center gap-2 max-[420px]:flex-col'>
                    <div id='user' className='flex items-center gap-1 '>
                        <Image src={author.picture} alt='pfp' width={15} height={15} className='rounded-2xl' />
                        <h4 className='text-dark200_light900'>{author.name}</h4>
                    </div>
                    <div id='ask-date' className='small-regular text-dark200_light900'> answered {getTimestamp(createdAt)}</div>
                </div>

                <div className='flex flex-wrap gap-3'>
                    <div className='flex items-center gap-1'>
                        <Image src='/assets/icons/like.svg' width={15} height={15} alt='' className='invert-colors' />
                        <h4 className='small-regular text-dark200_light900'>{formatAndDivideNumber(upvotes.length)} Votes</h4>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnswerCard