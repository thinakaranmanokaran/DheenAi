import React from 'react'

const Header = () => {

    // Delete now Messages
    function clearMessages() {
        localStorage.removeItem("dheenai_chat");
        window.location.reload();
    }

    return (
        <div className='bg-white hidden md:flex fixed w-screen shadow-xs min-h-16 items-center py-2 px-6'>
            <h1 className='font-bold text-4xl cursor-pointer' onClick={clearMessages}>DheenAI</h1>
        </div>
    )
}

export default Header