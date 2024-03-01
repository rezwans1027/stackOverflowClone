"use client"
import { downvoteAnswer, upvoteAnswer } from '@/lib/actions/answer.action'
import { viewQuestion } from '@/lib/actions/interaction.action'
import { downvoteQuestion, upvoteQuestion } from '@/lib/actions/question.action'
import { toggleSaveQuestion } from '@/lib/actions/user.action'
import { formatAndDivideNumber } from '@/lib/utils'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

interface Props {
  type: string
  itemId: string
  userId: string
  upvotes: number
  downvotes: number
  hasUpvoted: boolean
  hasDownvoted: boolean
  hasSaved?: boolean
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  downvotes,
  hasUpvoted,
  hasDownvoted,
  hasSaved
}: Props) => {

  const pathname = usePathname()

  useEffect(() => {
    viewQuestion({
      questionId: itemId,
      userId
    })
  }, [itemId, userId, pathname])

  const path = usePathname()

  const handleUpvote = async () => {
    if (!userId) return
    if (type === 'question') await upvoteQuestion({ questionId: itemId, userId, hasUpvoted, hasDownvoted, path })
    else if (type === 'answer') await upvoteAnswer({ answerId: itemId, userId, hasUpvoted, hasDownvoted, path })
  } 

  const handleDownvote = async () => {
    if (!userId) return
    if (type === 'question') await downvoteQuestion({ questionId: itemId, userId, hasUpvoted, hasDownvoted, path })
    else if (type === 'answer') await downvoteAnswer({ answerId: itemId, userId, hasUpvoted, hasDownvoted, path })
  }

  const handleSave = async () => {
    console.log(hasSaved)
    toggleSaveQuestion({ questionId: itemId, userId, path })
  }

  return (
    <div className='flex items-center gap-2'>
      <div className="flex">
        <button className='flex items-center gap-1' onClick={handleUpvote}>
          {hasUpvoted ? <Image src='/assets/icons/upvoted.svg' width={15} height={15} alt='' /> : <Image src='/assets/icons/upvote.svg' width={15} height={15} alt='' />}
          <p className='small-regular text-dark200_light900'>
            {formatAndDivideNumber(upvotes)}
          </p>
        </button>
      </div>
      <div className="flex">
        <button className='flex items-center gap-1' onClick={handleDownvote}>
          {hasDownvoted ? <Image src='/assets/icons/downvoted.svg' width={15} height={15} alt='' /> : <Image src='/assets/icons/downvote.svg' width={15} height={15} alt='' />}
          <p className='small-regular text-dark200_light900'>{formatAndDivideNumber(downvotes)}</p>
        </button>
      </div>
      {type === "question" && <div className="flex">
        <button className='flex items-center gap-1' onClick={handleSave}>
          {hasSaved ? <Image src='/assets/icons/star-filled.svg' width={15} height={15} alt='' /> : <Image src='/assets/icons/star-red.svg' width={15} height={15} alt='' />}
        </button>
      </div>}
    </div>
  )
}

export default Votes