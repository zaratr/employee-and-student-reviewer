import utilStyles from '../styles/utils.module.css';
import Link from 'next/link'
import index from '../styles/index.module.css'
import { useSession, signIn, signOut, getSession } from "next-auth/react";

import UserCard from '../components/UserCard';


import Header from '../components/Header';
import Footer from '../components/Footer';


export default function Home({ api_auth_user, listOfData }) {

  const { data: session, status } = useSession();

  // getting value from map by checking if database contains.

  // Page will not load before the user has signed in. Remove if we don't want.
  console.log("status", status);
  if (status != "authenticated") {
    console.log("Not authenticated");
  }
  if (!session) {
    return (

      <>
        <main className='d-flex flex-column min-vh-100'>
          <Header />

          {/* <button onClick={() => signIn()}>Sign in</button> */}


          <h1 className={index.header}>
            Welcome to this Site!
          </h1>

          <Footer />
        </main>
      </>
    )
  }
  else {//(session) - signed in user
    if (session.user.email.endsWith(process.env.NEXT_PUBLIC_STUDENT_EMAIL_ENDING)) {
      console.log("Session user", session.user.email);

      return (
       <>
          <Header user={session.user.email} />
          <main className=' min-vh-100'>

            <h1 className={index.header}>
              Welcome to the Website!
            </h1>

            <div className={''}>
            <Link className={'d-flex justify-content-center'} href={{
              pathname: "/add-user",
              query: { usertype: api_auth_user }
            }}>
              Add to your list of Companies you want to view in Queue
            </Link>

            <div className="container">
              {listOfData === null || listOfData.length === 0 ? (
                <h2>No Students in Queue to take care of!</h2>
              ) : (
                <ul className={'d-flex justify-content-center'}>
                  {listOfData?.map((element, i) => (
                    <UserCard user={element.S} key={i} usertype={api_auth_user} />
                  ))}
                </ul>
              )}
            </div>
            </div>

            <Footer />
          </main>
        </>
      )
    }
    else {//signed in as a employee

      return (
        <>
          <Header user={session.user.email} />
          <main className=' min-vh-100'>

            <h1 className={index.header}>
              Welcome to the Website!
            </h1>

            <div className={''}>
            <Link className={'d-flex justify-content-center'} href={{
              pathname: "/add-user",
              query: { usertype: api_auth_user }
            }}>
              Change to Queue of Students in the list to visit with!
            </Link>

            <div className="container">
              {listOfData === null || listOfData.length === 0 ? (
                <h2>No Students in Queue to take care of!</h2>
              ) : (
                <ul className={'d-flex justify-content-center'}>
                  {listOfData?.map((element, i) => (
                    <UserCard user={element.S} key={i} usertype={api_auth_user} />
                  ))}
                </ul>
              )}
            </div>
            </div>

            <Footer />
          </main>
        </>
      );
    }
  }


}

export async function getServerSideProps(ctx) {
  // get the current environment
  let dev = process.env.NODE_ENV !== 'production';
  let session = await getSession(ctx);
  let api_auth_type = 'user';
  let response = '';
  let data = '';
  let action = '';
  let uniqueEmail
  let userType;
  let queue = []
  if (session) {

    if (session.user.email.endsWith(process.env.NEXT_PUBLIC_STUDENT_EMAIL_ENDING)) {
      uniqueEmail = session.user.email;
      api_auth_type = "dynamoDb";
      action='GET';
      userType="student";
      response = await fetch(`http://localhost:3000/api/${api_auth_type}?uniqueEmail=${uniqueEmail}&userType=${userType}&queue=${queue}&action=${action}`);
      data = await response.json();
    }
    else{
      uniqueEmail = session.user.email;
      api_auth_type= "dynamoDb";
      action='GET';
      userType="employer"
      response = await fetch(`http://localhost:3000/api/${api_auth_type}?uniqueEmail=${uniqueEmail}&userType=${userType}&queue=${queue}&action=${action}`);
      data = await response.json();
    }
  }
  // request user from api
  // extract the data
  return {
    props: {
      listOfData: data?data['message']:'',
      api_auth_user: api_auth_type
    },
  }
}
