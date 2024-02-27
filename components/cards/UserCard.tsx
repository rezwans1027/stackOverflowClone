import Image from 'next/image'
import React from 'react'
import RenderTag from '../shared/RenderTag'
import Link from 'next/link'
import { getTopInteractedTags } from '@/lib/actions/tag.actions'

interface customParams {
    user: {
        _id: string
        clerkId: string
        picture: string
        name: string
        username: string
    }
}

const UserCard = async ({
    user
}: customParams) => {

    const interactedTags = await getTopInteractedTags({ userId: user._id })

    return (
        <Link
            href={`/profile/${user.clerkId}`}
        >
            <div className='card-shadow card-wrapper flex h-72 w-64 flex-col items-center truncate rounded-xl px-8 pt-8'>
                <Image
                    src={user.picture}
                    alt='user picture'
                    width={110}
                    height={110}
                    className='rounded-full'
                />
                <h2
                    className='h2-bold text-dark100_light900 mt-2 max-w-48 truncate'
                >{user.name}</h2>
                <h4 className='text-dark400_light500'>
                    @{user.username}
                </h4>
                <div className='mt-4 flex max-w-52 gap-2'>
                    {interactedTags && interactedTags.map((tag) => (
                        <RenderTag key={tag._id} _id={tag._id} name={tag.name} className=' flex-1 ' />
                    ))}
                </div>
            </div>
        </Link>
    )
}

export default UserCard

// {tags.map(tag => (
//     <div className='small-medium background-light750_dark300 text-light400_light500 flex-1 truncate rounded-md border-none px-3 py-2 text-center' key={tag}>{tag}</div>
// ))}