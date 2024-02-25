import QuestionCard from "@/components/cards/QuestionCard";
import Filters from "@/components/shared/Filters";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";

const questions = [
  {
    _id: 1,
    title: 'Cascading Deletes in SQLAlchemy?',
    tags: [{_id: 1, name: 'python'}, {_id: 2, name: 'sql'}],
    author: { _id: '1', name:'John Doe', picture: 'https://randomuser'},
    upvotes: 100,
    views: 100,
    answers: 2, 
    createdAt: new Date('2023-09-01T12:00:00.000Z')
  }
]

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href='/ask-question' className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">Ask a Question</Button>
        </Link>
      </div>

      <div className="mt-11 justify-between gap-5 max-sm:flex-col sm:items-center sm:max-md:flex md:gap-28">
        <LocalSearchbar
          route='/'
          iconPosition='left'
          imgSrc='assets/icons/search.svg'
          placeholder="Search for questions"
          otherClasses="flex-1 md:mb-8"
        />

        <Filters
          filters={HomePageFilters}
        />
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {questions.map(question => (
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
      </div> 


      {/* {<NoResult />} */}


    </>
  )
}