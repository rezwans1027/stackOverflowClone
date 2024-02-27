import UserCard from '@/components/cards/UserCard'
import Filters from '@/components/shared/Filters'
import NoResult from '@/components/shared/NoResult'
import LocalSearchBar from '@/components/shared/search/LocalSearchbar'
import { UserFilters } from '@/constants/filters'
import { getAllUsers } from '@/lib/actions/user.action'
import React from 'react'

const page = async () => {

  const result = await getAllUsers({})

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Users</h1>
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
          filters={UserFilters}
          spread={false}
        />
      </div>

      <div className='mt-8 flex flex-wrap gap-4'>
        {
          result && result.users?.length > 0 ?
            result?.users.map(user => (
              <UserCard
                key={user._id}
                picture={user.picture}
                name={user.name}
                username={user.username}
                tags={['react', 'nodejs', 'javascript']}
              />
            ))
            : <NoResult
            title="No users found"
            description="Try a different username or search for a different user. There are many amazing minds out there."
          />
        }
      </div>


    </>
  )
}

export default page