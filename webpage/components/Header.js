
import login from '../styles/login.module.css';
import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";
import { getMiddlewareRouteMatcher } from 'next/dist/shared/lib/router/utils/middleware-route-matcher';


function Header ({user}) {
  let userNameArray = "", userName = "", domainName = "";
  const [userInfo, setUserInfo] = useState(user ? user : "")
  console.log("is user defined. Is user logged in?", user);

  if(user)
  {
    userNameArray = user.split("@");
    userName = userNameArray[0].toLowerCase().trim();
    domainName = userNameArray[1].trim();
  }


  return (
    <header className={login.header}>
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a
            href="#"
            className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
          >

          </a>

          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li>
              <Link className="nav-link px-2 text-secondary" href={{pathname: "/"}}>
                <div className={login.homeTxt}>
                  Home
                </div>
              </Link>
            </li>
            <li>
              <Link href={{pathname:"fullQueue"}} className="nav-link px-2 text-white">
               Full Queue
              </Link>
            </li>
            {/* <li>
              <a href="#" className="nav-link px-2 text-white">
                Pricing
              </a>
            </li> */}
            {/* <li>
              <a href="#" className="nav-link px-2 text-white">
                FAQs
              </a>
            </li> */}
            <li>
              <Link href={{pathname:'studentQueue'}} className="nav-link px-2 text-white">
                Enter Queue
              </Link>
            </li>
            <li>
            </li>
        </ul>

          <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
            <input
              type="search"
              className="form-control form-control-dark"
              placeholder="Search..."
              aria-label="Search"
            />
          </form>

          {!user ?

          <div className="text-end">
              <button type="button" className={"btn btn-warning"} onClick={() => signIn()}>
                Login or Sign-up!
              </button>
          </div>
          :
          <div className="text-white d-flex">
            <p className={'me-2'}>Signed in as {userName}</p>
            <button type='button' className={"btn btn-outline-light me-2"} onClick={() => signOut()}>Sign out</button>
          </div>
          }

        </div>
      </div>
    </header>
  );
};
export default Header;
