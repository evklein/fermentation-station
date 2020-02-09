import React, { useState, useEffect } from 'react';
import { store } from '../../index';
import { Redirect } from 'react-router-dom';
import firebase from 'firebase';
import { Button, Card } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { CREATE_NEW_PROJECT, ProjectState } from '../../redux/types/ProjectTypes';
import { createNewProject, viewProject, deleteProject } from '../../redux/actions/ProjectActions';
import CreateProjectModal from './CreateProjectModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/fontawesome-free-solid';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBug, faWineBottle, faThermometerEmpty, faBacon, faSkull, faTrash } from '@fortawesome/free-solid-svg-icons';
import ModifyProjectModal from './ModifyProjectModal';

const Home = () => {
    const [dispatch, setDispatch] = useState(useDispatch);
    const [database, setDatabase] = useState(firebase.firestore());
    const [userProjects, setUserProjects] = useState([] as firebase.firestore.DocumentData[]);

    useEffect(() => {
        initializeProjects();
    }, []);

    const initializeProjects = () => {
        database.collection("projects").where('owner', '==', store.getState().auth.email).get().then((response) => {
            response.forEach((document) => {
                const documentData = document.data();
                documentData.documentID = document.id;
                dispatch(createNewProject(documentData));
            });
            
            setUserProjects(store.getState().projects.userProjects);
        });
    }

    // Check for new/updated/deleted items.
    store.subscribe(() => {
        setUserProjects(store.getState().projects.userProjects);
    })

    const formatDate = (seconds: number) => {
        return new Date(seconds * 1000).toLocaleDateString('en-US') + ' ' + 
                new Date(seconds * 10000).toLocaleTimeString('en-US');
    }

    const getStatusIcon = (project: firebase.firestore.DocumentData): IconProp => {
        switch (project.status) {
            case 'Bottled/2F':
                return faWineBottle;
            case 'Cold Rest':
                return faThermometerEmpty;
            case 'Curing':
                return faBacon;
            case 'Dead':
                return faSkull;
            default:
                return faBug;
        }
    }

    const editProject = (project: firebase.firestore.DocumentData) => {
        dispatch(viewProject(project));
    }

    const deleteItem = (project: firebase.firestore.DocumentData) => {
        firebase.firestore().doc('projects/' + project.documentID).delete().then((response) => {
            dispatch(deleteProject(project, project.documentID));
        })
    }

    return (
        <div>
            { !store.getState().auth.isLoggedIn ? <Redirect to="/sign-in" /> : '' }
            { userProjects.map((project: firebase.firestore.DocumentData) =>
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>{ project.name }
                            <Button variant="info" onClick={() => editProject(project)}>
                                <FontAwesomeIcon icon={faPencilAlt as IconProp}></FontAwesomeIcon>
                            </Button>
                            <Button variant="danger" onClick={() => deleteItem(project)}>
                                <FontAwesomeIcon icon={faTrash as IconProp}></FontAwesomeIcon>
                            </Button>
                        </Card.Title>
                        <Card.Text>
                            <FontAwesomeIcon icon={getStatusIcon(project)}></FontAwesomeIcon>
                            { project.status } <br/>
                            {/* Started: { formatDate(project.startDate.seconds) } <br />
                            { project.doneDate !== null ? 
                                <div>
                                    Done by: { formatDate(project.doneDate.seconds) }
                                </div> : ''
                            } */}
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
                            { project.feedHours > 0 ? <Button variant="outline-success">Fed Today</Button> : '' }
                            { project.burpHours > 0 ? <Button variant="outline-primary">Burped Today</Button> : '' }
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
            <CreateProjectModal></CreateProjectModal>
            <ModifyProjectModal></ModifyProjectModal>
        </div>
    );
}

export default Home;