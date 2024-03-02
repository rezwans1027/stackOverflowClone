"use client"
import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { usePathname } from 'next/navigation'
import { deleteAnswer } from '@/lib/actions/answer.action'
import { useToast } from "@/components/ui/use-toast"
import { deleteQuestion } from '@/lib/actions/question.action'

interface customProps {
    children: React.ReactNode
    title: string
    description: string
    type: string
    objectId: string
}



const Confirmation = ({ children, title, description, type, objectId }: customProps) => {
    const path = usePathname()
    const { toast } = useToast()


    const clickHandler = () => {
        switch (type) {
            case 'deleteAnswer': {
                deleteAnswer({ answerId: objectId, path });
                toast({ description: "Your answer has been deleted." },);
                break
            }
            case 'deleteQuestion': {
                deleteQuestion({ questionId: objectId, path });
                toast({ description: "Your question has been deleted." },);
                break
            }
            default: {
                break
            }

        }
    }




    return (
        <AlertDialog>
            <AlertDialogTrigger>{children}</AlertDialogTrigger>
            <AlertDialogContent className='background-light800_dark300 border-none dark:text-white  '>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className='text-red-500 dark:bg-red-500 dark:text-white'
                        onClick={clickHandler}
                    >Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default Confirmation