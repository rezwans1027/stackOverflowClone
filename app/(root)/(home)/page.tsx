import QuestionCard from "@/components/cards/QuestionCard";
import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import PaginationBar from "@/components/shared/PaginationBar";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import { getQuestions, getRecommendedQuestions } from "@/lib/actions/question.action";
import { URLProps } from "@/types";
import { auth } from "@clerk/nextjs";
import Link from "next/link";


export default async function Home({ searchParams }: URLProps) {

  const { userId } = auth();

  console.log(userId)

  let result;

  if (searchParams.filter === 'recommended') {
    if (userId) {
      result = await getRecommendedQuestions({ userId, searchQuery: searchParams.search?.toString() || '', page: parseInt(searchParams.page || '1'), pageSize: 10 })
      
    } else {
      result = []
    }

  } else {
    result = await getQuestions({ searchQuery: searchParams.search?.toString() || '', filter: searchParams.filter?.toString() || '', page: parseInt(searchParams.page || '1'), pageSize: 10 })
  }

  return (
    <div className="flex min-h-[78vh] flex-col justify-between gap-4">
      <div>
        <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="h1-bold text-dark100_light900">All Questions</h1>

          <Link href='/ask-question' className="flex w-fit justify-end max-sm:ml-auto">
            <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">Ask a Question</Button>
          </Link>
        </div>

        <div className="mt-11 justify-between gap-5 sm:items-center sm:max-md:flex md:gap-28">
          <LocalSearchbar
            route='/'
            iconPosition='left'
            imgSrc='assets/icons/search.svg'
            placeholder="Search for questions"
            otherClasses="flex-1 max-sm:mb-8 md:mb-8"
          />

          <Filters
            filters={HomePageFilters}
            spread={true}
          />
        </div>

        <div className="mt-8 flex flex-col gap-6">
            {result && 'questions' in result && result.questions.length > 0 ?
            result?.questions.map((question:any) => (
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
            :
            !(searchParams.filter === 'recommended' && !userId)
              ?
              (<NoResult
                title="There’s no question to show"
                description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. Our query could be the next big thing others learn from. Get involved! 💡"
                link="/ask-question"
                linkTitle="Ask a Question"
              />)
              : (<NoResult
                title="There’s no question to show"
                description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. Our query could be the next big thing others learn from. Get involved! 💡"
                link="/sign-in"
                linkTitle="Login"
              />)
          }
        </div>
      </div>

      <div >
        {Array.isArray(result) ? null : (
          <PaginationBar searchParams={searchParams} totalPages={result.totalPages} />
        )}
      </div>


    </div>
  )
}