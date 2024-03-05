import QuestionCard from '@/components/cards/QuestionCard'
import NoResult from '@/components/shared/NoResult'
import LocalSearchBar from '@/components/shared/search/LocalSearchbar'
import { getQuestionsByTag } from '@/lib/actions/tag.actions'
import { URLProps } from '@/types'
import React from 'react'

const Page = async ({params, searchParams }:URLProps) => {

  const result = await getQuestionsByTag({ tagId: params.id, searchQuery: searchParams.search?.toString() || ''});

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">{result?.tagTitle}</h1>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route='/'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder="Search Questions"
          otherClasses="flex-1 "
        />
      </div>

      <div className='mt-8 flex flex-col gap-6'>
        {
          result?.questions && result?.questions.length > 0 ?
          result?.questions?.map((question:any) => (
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
          ))
            : <NoResult
              title="No Questions found"
              description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. Our query could be the next big thing others learn from. Get involved! 💡"
            />
        }
      </div>


    </>
  )
}

export default Page