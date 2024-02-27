import Image from 'next/image'
import React from 'react'

interface customParams {
    picture: string
    name: string
    username: string
    tags: string[]
}

const UserCard = ({
    picture,
    name,
    username,
    tags,
}: customParams) => {
    return (
        <div className='card-shadow card-wrapper flex h-72 w-64 flex-col items-center truncate rounded-xl px-8 pt-8'>
            <Image
                src={picture}
                alt='user picture'
                width={110}
                height={110}
                className='tbb rounded-full'
            />
            <h2
                className='h2-bold text-dark100_light900 mt-2 max-w-48 truncate'
            >{name}</h2>
            <h4 className='text-dark400_light500'>
                @{username}
            </h4>
            <div className='mt-4 flex max-w-52 gap-2'>
                {tags.map(tag => (
                    <div className='small-medium background-light750_dark300 text-light400_light500 flex-1 truncate rounded-md border-none px-3 py-2 text-center' key={tag}>{tag}</div>
                ))}
            </div>

        </div>
    )
}

export default UserCard