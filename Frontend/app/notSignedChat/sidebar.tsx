import { Button } from '@/components/ui/button'
import React from 'react'




const Sidebar = () => {

    return (
        <div className="h-full w-full flex flex-col rounded-lg p-4 bg-zinc-900">
            {/* New Chat Button */}
            <div className="mb-4">
                <Button className="w-full" variant="default">
                    + New Chat
                </Button>
            </div>

            {/* Previous Chats List */}

            {/* Logout and User Info */}
            <div className="mt-auto flex items-center justify-between gap-2 w-full">
                <Button
                    className='w-full'
                    variant='signedin'
                    onClick={() => {
                        window.location.href = "/signin";
                    }}
                >
                    Signin
                </Button>
            </div>
        </div >
    )
}

export default Sidebar