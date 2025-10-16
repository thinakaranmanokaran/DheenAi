import React, { useState, useRef, useEffect } from "react";
import { Caret } from "../components";
import { BiSolidSend } from "react-icons/bi";
import { TbCopy, TbCopyCheckFilled } from "react-icons/tb";

const Home = () => {
    const [text, setText] = useState("");
    const [caretPos, setCaretPos] = useState(0);
    const [messages, setMessages] = useState([]);
    const inputRef = useRef(null);
    const measureRef = useRef(null);
    const chatRef = useRef(null);
    const [copyIcon, setCopyIcon] = useState(false);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (!measureRef.current) return;
        const width = measureRef.current.offsetWidth;
        setCaretPos(width);
    }, [text]);

    // ✅ Auto-scroll to latest message
    useEffect(() => {
        chatRef.current?.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    const handleSend = async () => {
        if (!text.trim()) return;

        const userMsg = { sender: "user", text };
        setText("");

        // Add user message + placeholder AI message once
        setMessages((prev) => [...prev, userMsg, { sender: "ai", text: "Thinking..." }]);

        try {
            const proxy = "https://api.allorigins.win/get?url=";
            const api = `https://dheenai.onrender.com/?text=${encodeURIComponent(
                userMsg.text
            )}`;
            const res = await fetch(proxy + encodeURIComponent(api));
            const data = await res.json();

            // Replace the "Thinking..." message with the real one
            setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    sender: "ai",
                    text: data.contents || "No response.",
                };
                return updated;
            });
        } catch (err) {
            setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    sender: "ai",
                    text: "⚠️ Error connecting to DheenAI.",
                };
                return updated;
            });
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopyIcon(true);
        setTimeout(() => setCopyIcon(false), 2000);
    };

    return (
        <div className="flex justify-center py-4 items-center h-screen">
            <div className="w-3/5 border-x border-x-black/20 h-full flex flex-col">
                <h1 className="text-5xl mt-20 text-center mb-10">Welcome to DheenAI</h1>

                {/* Chat Section */}
                <div ref={chatRef} className="flex-1 overflow-y-auto px-8 space-y-4 pb-32">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex group transition-all items-center duration-300 ${msg.sender === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            {msg.sender === "user" && <button className="text-xl transition-all duration-300 mx-1 hover:bg-black/10 h-fit p-2 rounded-xl cursor-pointer group-hover:block hidden " onClick={() => handleCopy(msg.text)}>{copyIcon ? <TbCopyCheckFilled /> : <TbCopy />}</button>}
                            <div
                                className={`px-5 py-3 rounded-2xl max-w-[75%] shadow-sm ${msg.sender === "user"
                                    ? "bg-black text-white rounded-br-none"
                                    : "bg-white text-black rounded-bl-none"
                                    }`}
                            >
                                {msg.text}
                            </div>
                            {msg.sender !== "user" && <button className="text-xl transition-all duration-300 mx-1 hover:bg-black/10 h-fit p-2 rounded-xl cursor-pointer group-hover:block hidden " onClick={() => handleCopy(msg.text)}>{copyIcon ? <TbCopyCheckFilled /> : <TbCopy />}</button>}
                        </div>
                    ))}
                </div>

                {/* Input Bar */}
                <div className="fixed min-h-16 flex items-center bottom-0 z-20 pb-4 w-full left-0 bg-light  justify-center">
                    <div className="relative flex items-center w-3/5">

                        <span
                            ref={measureRef}
                            className="absolute left-8 invisible whitespace-pre font-sans text-base px-8"
                        >
                            {text}
                        </span>
                        <input
                            ref={inputRef}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            type="text"
                            className="w-full  px-8 border rounded-full min-h-16 focus:outline-none"
                            placeholder="Type something..."
                        /> 
                        {/* caret-transparent */}
                        <button
                            onClick={handleSend}
                            className={`text-light bg-black text-2xl p-3 cursor-pointer shadow-xs hover:shadow-md disabled:bg-black/50 transition-all duration-300 rounded-full absolute right-2 disabled:cursor-not-allowed`}
                            disabled={!text}
                        >
                            <BiSolidSend />
                        </button>
                        {/* <div
                            className={`absolute z-30 -translate-x-7`}
                            style={{ left: `calc(${caretPos}px)` }}
                        >
                            <Caret />
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
