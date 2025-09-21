"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Sidebar from "./sidebar";
import { useState } from "react";


export default function UnsignedChatPage() {
    const [inputValue, setInputValue] = useState("");



    return (
        <div className="h-screen flex w-full p-4 gap-4">
            <div className="w-[17%]">
                <Sidebar />
            </div>
            <div className="w-full flex flex-col justify-between">
                <div className="w-full h-full items-center p-8 overflow-y-scroll">
                </div>
                {

                    < div className="w-full relative flex items-center justify-center gap-4">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!inputValue.trim()) return;
                                window.location.href = "/signin";
                            }}
                            className="w-1/2 flex gap-4"
                        >
                            <Textarea
                                className="w-full"
                                placeholder="Type your message here"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <Button variant={"outline"} className="min-h-10" type="submit" disabled={!inputValue.trim()}>
                                Submit
                            </Button>
                        </form>
                    </div>
                }
            </div>
        </div >
    );
}
