"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { UserSchema } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { updateUserProfile } from "@/lib/actions/user.action"


interface Props {
    userId: string
    name: string
    username: string
    portfolioWebsite: string
    location: string
    bio: string
}

const Profile = ({
    userId,
    name,
    username,
    portfolioWebsite,
    location,
    bio,
}: Props) => {
    const [saving, setSaving] = useState(false)
    const path = usePathname()
    const router = useRouter()

    // 1. Define your form.
    const form = useForm<z.infer<typeof UserSchema>>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            name: name || '',
            username: username || "",
            portfolioWebsite: portfolioWebsite || "",
            location: location || "",
            bio: bio || "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof UserSchema>) {
        setSaving(true);
        (async () => {
            try {
                await updateUserProfile({ clerkId: userId, updateData: values, path });
            } catch (error) {
                console.error(error);
            } finally {
                setSaving(false);
                router.push(`/profile/${userId}`);
            }
        })();
    }


    return (
        <div>
            <div>
                <h1 className='h1-bold text-dark100_light900'>Edit Profile</h1>

                <div className='mt-9 '>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="flex w-full flex-col">
                                        <FormLabel className="paragraph-semibold text-dark400_light800">Name
                                            <span className="text-primary-500">*</span></FormLabel>
                                        <FormControl className="mt-3.5">
                                            <Input className="no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"  {...field} />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem className="flex w-full flex-col">
                                        <FormLabel className="paragraph-semibold text-dark400_light800">Username
                                            <span className="text-primary-500">*</span></FormLabel>
                                        <FormControl className="mt-3.5">
                                            <Input className="no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"  {...field} />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="portfolioWebsite"
                                render={({ field }) => (
                                    <FormItem className="flex w-full flex-col">
                                        <FormLabel className="paragraph-semibold text-dark400_light800">Portfolio Link</FormLabel>
                                        <FormControl className="mt-3.5">
                                            <Input className="no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"  {...field} placeholder="Your portfolio link" />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem className="flex w-full flex-col">
                                        <FormLabel className="paragraph-semibold text-dark400_light800">Location</FormLabel>
                                        <FormControl className="mt-3.5">
                                            <Input className="no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"  {...field} placeholder="Where are you from?" />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem className="flex w-full flex-col">
                                        <FormLabel className="paragraph-semibold text-dark400_light800">Bio</FormLabel>
                                        <FormControl className="mt-3.5">
                                            <Input className="no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"  {...field} placeholder="Tell us about yourself" />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-row-reverse">
                                <Button type="submit" className='primary-gradient w-fit !text-light-900' >
                                    {saving ? 'Saving...' : 'Save'}
                                </Button>
                            </div>

                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}


export default Profile