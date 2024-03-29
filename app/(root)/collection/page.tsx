import QuestionCard from '@/components/cards/QuestionCard'

import Filters from '@/components/shared/Filters'
import NoResult from '@/components/shared/NoResult'
import PaginationBar from '@/components/shared/PaginationBar'
import LocalSearchBar from '@/components/shared/search/LocalSearchbar'
import { QuestionFilters } from '@/constants/filters'
import { getSavedQuestions } from '@/lib/actions/question.action'
import { URLProps } from '@/types'
import { auth } from '@clerk/nextjs'
import React from 'react'

const Page = async ({ searchParams }: URLProps) => {

  const { userId } = auth()

  const result = await getSavedQuestions({ clerkId: userId!, searchQuery: searchParams.search?.toString() || '', filter: searchParams.filter?.toString() || '', page: parseInt(searchParams.page || '1'), pageSize: 3 })

  return (
    <div className='flex min-h-[78vh] flex-col justify-between'>
      <div>
        <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
        </div>

        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <LocalSearchBar
            route='/'
            iconPosition='left'
            imgSrc='assets/icons/search.svg'
            placeholder="Search amazing minds"
            otherClasses="flex-1 "
          />

          <Filters
            filters={QuestionFilters}
            spread={false}
          />
        </div>

        <div className='mt-8'>
          {
            result && result.savedQuestions.length > 0 ?
              <div className='flex flex-col gap-6'>
                {result?.savedQuestions.map((question: any) => (
                  <QuestionCard
                    key={question._id}
                    _id={question._id}
                    title={question.title}
                    tags={question.tags}
                    author={question.author}
                    upvotes={question.upvotes}
                    views={question.views}
                    answers={question.answers}
                    createdAt={question.createdAt}
                  />

                ))}

                <PaginationBar searchParams={searchParams} totalPages={result?.totalPages} />
              </div>
              : <NoResult
                title="No Questions found"
                description="Save the questions that you might need later, so that you never lose them."
              />
          }
        </div>
      </div>

      {/* <PaginationBar searchParams={searchParams} totalPages={result?.totalPages} /> */}

    </div>
  )
}

export default Page

