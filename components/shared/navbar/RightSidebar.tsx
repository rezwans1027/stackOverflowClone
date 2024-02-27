import Image from 'next/image'
import React from 'react'
import RenderTag from './RenderTag'

const RightSidebar = () => {
    return (
        <div className='background-light900_dark200 sticky right-0 top-0 z-40 h-[100vh] w-96 p-6 shadow-xl dark:shadow-none max-xl:hidden'>

            <div className='mt-28 dark:text-white'>
                <h3 className='h3-bold'>Top Questions</h3>
                <div className='mt-8 flex flex-col gap-6'>
                    <div className='flex items-center justify-center'>
                        <p className='body-medium text-dark500_light700'>This is an example question and I am just writing things</p>
                        <Image src='/assets/icons/chevron-right.svg' width={20} height={20} alt='arrow' className='invert-colors' />
                    </div>
                    <div className='flex items-center justify-center'>
                        <p className='body-medium text-dark500_light700'>This is an example question and I am just writing things just for the purpose of this example and it doesnt actually</p>
                        <Image src='/assets/icons/chevron-right.svg' width={20} height={20} alt='arrow' className='invert-colors' />
                    </div>
                </div>
            </div>

            <div>
                <h3 className='h3-bold mt-20 dark:text-white'>Popular Tags</h3>

                <div className='mt-8 flex flex-col gap-4'>
                    <div className='flex items-center justify-between'>
                        <RenderTag >NEXTJS</RenderTag>
                        <p className='small-medium text-dark500_light700'>23</p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <RenderTag >NEXTJS</RenderTag>
                        <p className='small-medium text-dark500_light700'>23</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RightSidebar