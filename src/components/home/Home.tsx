import React, { useState, useEffect } from 'react';
import { store } from '../../index';
import { Redirect } from 'react-router-dom';
import firebase from 'firebase';


const Home = () => {
    const [database, setDatabase] = useState(firebase.firestore());
    const [userProjects, setUserProjects] = useState();

    useEffect(() => {
        database.collection("projects").where('owner', '==', store.getState().auth.email).get().then((response) => {
            response.forEach((doc) => {
                console.log(doc.data());
            })
        })
    }, []);

    console.log(userProjects);
    return (
        <div>
            { !store.getState().auth.isLoggedIn ? <Redirect to="/sign-in" /> : '' }
            
        </div>
    );
}

export default Home;