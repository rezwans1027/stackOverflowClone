import Filters from '@/components/shared/Filters'
import NoResult from '@/components/shared/NoResult'
import PaginationBar from '@/components/shared/PaginationBar'
import LocalSearchBar from '@/components/shared/search/LocalSearchbar'
import { TagFilters } from '@/constants/filters'
import { getAllTags } from '@/lib/actions/tag.actions'
import { URLProps } from '@/types'
import Link from 'next/link'
import React from 'react'

const page = async ({ searchParams }: URLProps) => {

    const result = await getAllTags({ searchQuery: searchParams.search?.toString() || '', filter: searchParams.filter?.toString() || '', page: parseInt(searchParams.page?.toString() || '1'), pageSize: 24 })

    return (
        <div className='flex min-h-[78vh] flex-col justify-between gap-4' >
            <div>
                <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
                    <h1 className="h1-bold text-dark100_light900">All Users</h1>
                </div>

                <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                    <LocalSearchBar
                        route='/'
                        iconPosition='left'
                        imgSrc='assets/icons/search.svg'
                        placeholder="Search Tags"
                        otherClasses="flex-1 "
                    />

                    <Filters
                        filters={TagFilters}
                        spread={false}
                    />
                </div>

                <section className="mt-12 flex flex-wrap justify-center gap-4">

                    {result && result.tags.length > 0 ? (
                        result.tags.map((tag) => (
                            <Link href={`/tags/${tag._id}`} key={tag._id} className="shadow-light100_darknone">
                                <div className="background-light900_dark200 light-border flex h-48 w-[190px] flex-col items-center justify-center rounded-2xl border px-4 py-5">
                                    <div className="background-light700_dark400 w-fit rounded-sm px-5 py-1.5">
                                        <p className="paragraph-semibold text-dark300_light900">
                                            {tag.name}
                                        </p>
                                    </div>

                                    <p className="small-medium text-dark400_light500 mt-3.5">
                                        <span className="body-semibold primary-text-gradient mr-2.5">{tag.questionCount}+</span> Questions
                                    </p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <NoResult
                            title="No Tags Found"
                            description="It looks like there are no tags found."
                            link="/ask-question"
                            linkTitle="Ask a question"
                        />
                    )}
                </section>

            </div>


            <PaginationBar searchParams={searchParams} totalPages={result?.totalPages} />
        </div>
    )
}

export default page