import React, { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'

const RenderTag = ({ children }: { children: ReactNode }) => {
    return (
        <Badge className='subtle-medium background-light700_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase'>
            {children}
        </Badge>
    )
}

export default RenderTag