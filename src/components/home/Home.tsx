import React, { useState, useEffect } from 'react';
import { store } from '../../index';
import { Redirect } from 'react-router-dom';
import firebase from 'firebase';
import { Button, Card, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { CREATE_NEW_PROJECT, ProjectState } from '../../redux/types/ProjectTypes';
import { createNewProject, viewProject, deleteProject, updateProject } from '../../redux/actions/ProjectActions';
import CreateProjectModal from './CreateProjectModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faUtensilSpoon, faBomb, faClock } from '@fortawesome/fontawesome-free-solid';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBug, faWineBottle, faThermometerEmpty, faBacon, faSkull, faTrash } from '@fortawesome/free-solid-svg-icons';
import ModifyProjectModal from './ModifyProjectModal';
import { formatDate, SECONDS_IN_4_HOURS } from '../../utility/helper';

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

    const setFeedToNow = (project: firebase.firestore.DocumentData) => {
        project.lastFeedTime = Date.now();
        firebase.firestore().doc('projects/' + project.documentID).set(project).then((response) => {
            dispatch(updateProject(project, project.documentID));
        });
    }

    const setBurpToNow = (project: firebase.firestore.DocumentData) => {
        project.lastBurpTime = Date.now();
        firebase.firestore().doc('projects/' + project.documentID).set(project).then((response) => {
            dispatch(updateProject(project, project.documentID));
        });
    }

    const showBurpAlert = (project: firebase.firestore.DocumentData): string => {
        if (project.lastBurpTime === 0) return '';
        else if (Date.now() - project.lastBurpTime > project.burpTime - SECONDS_IN_4_HOURS) {
            return 'This project should be burped soon to prevent explosions.'
        }

        return ''; 
    }

    const showFeedAlert = (project:firebase.firestore.DocumentData): string => {
        if (project.lastFeedTime === 0) return '';
        else if (Date.now() - project.lastFeedTime > project.feedTime - SECONDS_IN_4_HOURS) {
            return 'This project should be fed soon.'
        }

        return '';
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
                            Started: { formatDate(project.startDate) } <br />
                            { project.doneDate !== null ? 
                                <div>
                                    Done by: { formatDate(project.doneDate) }
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
                            { showFeedAlert(project) || showBurpAlert(project) ?
                                <Alert variant="warning">
                                    { showBurpAlert(project) ?
                                        <div>
                                            <FontAwesomeIcon icon={faBomb as IconProp} /> {showBurpAlert(project)}
                                        </div>
                                    : ''}
                                    { showFeedAlert(project) ?
                                        <div>
                                            <FontAwesomeIcon icon={faClock as IconProp} /> {showFeedAlert(project)}
                                        </div>
                                    : ''}
                                </Alert> : ''
                            }
                            { project.burpTime > 0 ? <Button variant="outline-primary" onClick={() => { setBurpToNow(project) }}>Burped Today</Button> : '' }
                            { project.feedTime > 0 ? <Button variant="outline-success" onClick={() => { setFeedToNow(project) }}>Fed Today</Button> : '' }
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