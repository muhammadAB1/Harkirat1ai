"use client"

import { useEffect, useState } from "react";
import ChatPage from "./chat/page";
import UnsignedChatPage from "./notSignedChat/page";

export default function Home() {

  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsSignedIn(true);
    } else {
      setIsSignedIn(false);
    }
  }, []);

  return (
    isSignedIn ? (<ChatPage setIsSignedIn={setIsSignedIn} />) : (<UnsignedChatPage />)
  );
}
