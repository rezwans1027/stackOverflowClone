import Image from 'next/image'
import React from 'react'

const Stats = ({ answers, questions }) => {
    return (
        <div className='grid grid-cols-4 gap-2 max-sm:grid-cols-2 max-xs:grid-cols-1'>

            <div className='card-wrapper flex flex-wrap gap-2 rounded-xl p-4 dark:text-white'>
                <div className='mx-auto flex flex-col items-center justify-center'><span className='base-bold'>{questions}</span> Questions</div>
                <div className='mx-auto flex flex-col items-center justify-center'><span className='base-bold'>{answers}</span> Answers</div>
            </div>
            <div className='card-wrapper flex flex-wrap gap-2 rounded-xl p-4 dark:text-white'>
                <Image src='/assets/icons/gold-medal.svg' height={35} width={35} alt='gold-medal' className='mx-auto'   />
                <div className='mx-auto flex flex-col items-center justify-center'><span className='base-bold'>0</span> Gold Badges</div>
            </div>
            <div className='card-wrapper flex flex-wrap gap-2 rounded-xl p-4 dark:text-white'>
                <Image src='/assets/icons/silver-medal.svg' height={35} width={35} alt='gold-medal' className='mx-auto'   />
                <div className='mx-auto flex flex-col items-center justify-center'><span className='base-bold'>0</span> Silver Badges</div>
            </div>
            <div className='card-wrapper flex flex-wrap gap-2 rounded-xl p-4 dark:text-white'>
                <Image src='/assets/icons/bronze-medal.svg' height={35} width={35} alt='gold-medal' className='mx-auto'   />
                <div className='mx-auto flex flex-col items-center justify-center'><span className='base-bold'>0</span> Bronze Badges</div>
            </div>

        </div>
    )
}

export default Stats