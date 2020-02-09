import React, { useState, useEffect } from 'react';
import { store } from '../../index';
import { Redirect } from 'react-router-dom';
import firebase from 'firebase';
import { Button, Card } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { CREATE_NEW_PROJECT } from '../../redux/types/ProjectTypes';
import { createNewProject } from '../../redux/actions/ProjectActions';
import CreateProjectModal from './CreateProjectModal';


const Home = () => {
    const [dispatch, setDispatch] = useState(useDispatch);
    const [database, setDatabase] = useState(firebase.firestore());
    const [userProjects, setUserProjects] = useState([] as firebase.firestore.DocumentData);

    useEffect(() => {
        initializeProjects();
    });

    const initializeProjects = () => {
        let count = 1;
        database.collection("projects").where('owner', '==', store.getState().auth.email).get().then((response) => {
            response.forEach((document) => {
                const documentData = document.data();
                dispatch(createNewProject(documentData));
            });
            
            setUserProjects(store.getState().projects.userProjects);
        });
    }

    const formatDate = (seconds: number) => {
        return new Date(seconds * 1000).toLocaleDateString('en-US') + ' ' + 
                new Date(seconds * 10000).toLocaleTimeString('en-US');
    }

    return (
        <div>
            { !store.getState().auth.isLoggedIn ? <Redirect to="/sign-in" /> : '' }
            { userProjects.map((project: firebase.firestore.DocumentData) =>
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>{ project.name }</Card.Title>
                        <Card.Text>
                            { project.status } <br/>
                            Started: { formatDate(project.startDate.seconds) } <br />
                            { project.doneDate !== null ? 
                                <div>
                                    Done by: { formatDate(project.doneDate.seconds) }
                                </div> : ''
                            }
                            { project.feedMaterial ?
                                <div>
                                    Feed Material: { project.feedMaterial } 
                                </div> : ''
                            }
                            { project.notes ? 
                                <div>
                                    Notes: { project.notes }
                                </div> : ''
                            }
                            { project.feedHours ? <Button variant="outline-success">Fed Today</Button> : '' }
                            { project.burpHours ? <Button variant="outline-primary">Burped Today</Button> : '' }
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
            <CreateProjectModal></CreateProjectModal>
        </div>
    );
}

export default Home;