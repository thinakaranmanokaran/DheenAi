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

    // 🧠 Load chat history from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("dheenai_chat");
        if (saved) {
            setMessages(JSON.parse(saved));
        }
        inputRef.current?.focus();
    }, []);

    // 🧠 Save messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem("dheenai_chat", JSON.stringify(messages));
        }
    }, [messages]);

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

        // Add user message + placeholder AI message
        setMessages((prev) => [...prev, userMsg, { sender: "ai", text: "Thinking..." }]);

        try {
            const proxy = "https://api.allorigins.win/get?url=";
            const api = `https://dheenai.onrender.com/?text=${encodeURIComponent(userMsg.text)}`;
            const response = await fetch(proxy + encodeURIComponent(api));

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (!data?.contents) {
                throw new Error("Empty or invalid response from DheenAI.");
            }

            // Replace "Thinking..." with real AI response
            setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    sender: "ai",
                    text: data.contents,
                    isError: false,
                };
                return updated;
            });
        } catch (err) {
            console.error("DheenAI Error:", err);

            let friendlyMessage = "⚠️ Something went wrong. Please try again.";

            if (err.message.includes("408")) {
                friendlyMessage = "⏳ The server took too long to respond. Please try again in a moment.";
            } else if (err.message.includes("Failed to fetch")) {
                friendlyMessage = "🌐 Network error — check your internet or try again.";
            } else if (err.message.includes("500")) {
                friendlyMessage = "💥 Server error — DheenAI might be down.";
            } else if (err.message.includes("CORS")) {
                friendlyMessage = "🚫 CORS issue — please refresh or try without proxy.";
            }

            setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    sender: "ai",
                    text: friendlyMessage + `\n\n(Details: ${err.message})`,
                    isError: true,
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
        <div className="flex justify-center py-4 items-center h-[calc(100vh-64px)]">
            <div className="w-3/5 border-x border-x-black/20 h-full flex flex-col">
                <h1 className="text-5xl top-0 sticky text-center my-4">Welcome to DheenAI</h1>

                {/* Chat Section */}
                <div ref={chatRef} className="flex-1 overflow-y-auto px-8 space-y-4 pb-32">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex group transition-all items-center duration-300 ${msg.sender === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            {msg.sender === "user" && (
                                <button
                                    className="text-xl transition-all duration-300 mx-1 hover:bg-black/10 h-fit p-2 rounded-xl cursor-pointer group-hover:block hidden"
                                    onClick={() => handleCopy(msg.text)}
                                >
                                    {copyIcon ? <TbCopyCheckFilled /> : <TbCopy />}
                                </button>
                            )}
                            <div
                                className={`px-5 py-3 rounded-2xl max-w-[60%] shadow-sm ${msg.sender === "user"
                                        ? "bg-black text-white rounded-br-none"
                                        : msg.isError
                                            ? "bg-red-50 text-red-600 border border-red-300 rounded-bl-none"
                                            : "bg-white text-black rounded-bl-none"
                                    }`}
                            >
                                {msg.text}
                            </div>
                            {msg.sender !== "user" && (
                                <button
                                    className="text-xl transition-all duration-300 mx-1 hover:bg-black/10 h-fit p-2 rounded-xl cursor-pointer group-hover:block hidden"
                                    onClick={() => handleCopy(msg.text)}
                                >
                                    {copyIcon ? <TbCopyCheckFilled /> : <TbCopy />}
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Input Bar */}
                <div className="fixed min-h-16 flex items-center bottom-0 z-20 pb-4 w-full left-0 bg-light justify-center">
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
                            className="w-full px-8 border rounded-full min-h-16 focus:outline-none"
                            placeholder="Type something..."
                        />
                        <button
                            onClick={handleSend}
                            className={`text-light bg-black text-2xl p-3 cursor-pointer shadow-xs hover:shadow-md disabled:bg-black/50 transition-all duration-300 rounded-full absolute right-2 disabled:cursor-not-allowed`}
                            disabled={!text}
                        >
                            <BiSolidSend />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
