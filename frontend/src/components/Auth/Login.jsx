import React from 'react'

const Login = () => {
  return (
    <div>
      <div className="h-screen w-screen flex justify-between items-center">
        <form className="bg-[#2f2f2f] w-[40%] h-[60%]">
            <p>Login</p>
            <input type="text" />
            <input type="password" name="" id="" />
            <button type="submit"></button>
        </form>
        <div className="">
          <button>Sign Up</button>
        </div>
      </div>
    </div>
  )
}

export default Login
