import { URLProps } from "@/types"
import { getUserProfile } from "@/lib/actions/user.action"
import Profile from "@/components/forms/Profile"

const Page = async ({ params }: URLProps) => {

    const result = await getUserProfile({ userId: params.id })

    if (!result) return (
        <div>
            <h1>Loading...</h1>
        </div>
    )

    return (
        <div>
            <Profile
                userId={result.user.clerkId}
                name={result.user.name}
                username={result.user.username}
                portfolioWebsite={result.user.portfolioWebsite}
                location={result.user.location}
                bio={result.user.bio}
            />
        </div>
    )
}


export default Page