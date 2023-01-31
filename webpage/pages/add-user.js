import { useState } from 'react';

// import Nav from '../components/Nav';
import styles from '../styles/Home.module.css';
import Header from '../components/Header'
import {useRouter} from "next/router";


export default function AddUser() {
    const [name_user, setNameUser] = useState('');
    const [about_user, setAbout] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');


    const router = useRouter();
    const typeofuser = router.query.usertype?.trim();
    const oppositeTypeOfUser = typeofuser==='employee'?'student':'employee';
    const handleUser = async (e) => {
        e.preventDefault();

        // reset error and message
        setError('');
        setMessage('');

        // fields check
        if (!name_user || !about_user) return setError('All fields are required');

        // user structure
        let userQueries = {
            uniqueEmail:"employer3@example.com",
            userType:"employer",
            newItemForQueue: 'newItem2',
            action:'PUT'
            //isVisited: false,
            //published: false,
            //createdAt: new Date().toISOString(),
        };

        // save the user
        let response = await fetch(`/api/${typeofuser}`, {
            method: 'PUT',
            body: JSON.stringify(userQueries),
        });

        // get the data
        let data = await response.json();

        if (data.success) {
            // reset the fields
            setNameUser('');
            setAbout('');
            // set the message
            return setMessage(data.message);
        } else {
            // set the error
            return setError(data.message);
        }
    };

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <form onSubmit={handleUser} className={styles.form}>
                    {error ? (
                        <div className={styles.formItem}>
                            <h3 className={styles.error}>{error}</h3>
                        </div>
                    ) : null}
                    {message ? (
                        <div className={styles.formItem}>
                            <h3 className={styles.message}>{message}</h3>
                        </div>
                    ) : null}
                    <div className={styles.formItem}>
                        <label>Title</label>
                        <input
                            type="text"
                            name="name_user"
                            onChange={(e) => setNameUser(e.target.value)}
                            value={name_user}
                            placeholder={`name of ${oppositeTypeOfUser}`}
                        />
                    </div>
                    <div className={styles.formItem}>
                        <label>About {oppositeTypeOfUser}</label>
                        <textarea
                            name="about_user"
                            onChange={(e) => setAbout(e.target.value)}
                            value={about_user}
                            placeholder={`about ${oppositeTypeOfUser}`}
                        />
                    </div>
                    <div className={styles.formItem}>
                        <button type="submit">Add user</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
