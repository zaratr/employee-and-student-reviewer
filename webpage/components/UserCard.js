import { useState } from 'react';
import { useRouter } from 'next/router';

export default function UserCard({ user, usertype }) {
    const [publishing, setPublishing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    // Publish user
    const publishUser = async (userId) => {
        // change publishing state
        setPublishing(true);

        try {
            // Update user
            await fetch(`/api/${usertype}`, {
                method: 'PUT',
                body: userId,
            });

            // reset the publishing state
            setPublishing(false);

            // reload the page
            return router.push(router.asPath);
        } catch (error) {
            // Stop publishing state
            return setPublishing(false);
        }
    };
    // Delete user
    const deleteUser = async (userId) => {
        //change deleting state
        setDeleting(true);

        let userQueries = {
            uniqueEmail:"employer3@example.com",
            userType:"employer",
            newItemForQueue: 'newItem1',
            action:'DELETE-QUEUE-ELEM'
            //isVisited: false,
            //published: false,
            //createdAt: new Date().toISOString(),
        };

        try {
            // Delete user
            await fetch(`/api/${usertype}`, {
                method: 'DELETE',//not important anymore. only uses crud strings
                body: JSON.stringify(userQueries),
            });

            // reset the deleting state
            setDeleting(false);

            // reload the page
            return router.push(router.asPath);
        } catch (error) {
            // stop deleting state
            return setDeleting(false);
        }
    };
     return (
             <li className={'d-flex flex-column w-25'}>
             <h3>{user}</h3>
                 {/*<h3>{user.name_user}</h3>*/}
                 {/*<p>{user.about_user}</p>*/}
                 {/*<small>{new Date(user.createdAt).toLocaleDateString()}</small>*/}
                 <div className={''}>

                 {!user.published ? (
                     <button type="button" onClick={() => publishUser(user._id)}>
                         {publishing ? 'Publishing' : 'Publish'}
                     </button>
                 ) : null}
                 <button type="button" onClick={() => deleteUser(user['_id'])}>
                     {deleting ? 'Deleting' : 'Delete'}
                 </button>
                 </div>
             </li>
     );
}
