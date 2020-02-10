import { Modal, Button, FormControl, Form, Card} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import firebase, { firestore } from 'firebase';
import { store } from '../../index';
import { useDispatch } from 'react-redux';
import { createNewProject, updateProject } from '../../redux/actions/ProjectActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCheck } from '@fortawesome/fontawesome-free-solid';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { formatDate } from '../../utility/helper';

const ModifyProjectModal = () => {
    const [dispatch, setDispatch] = useState(useDispatch);
    const [modalOpen, setModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [notes, setNotes] = useState('');
    const [needsBurp, setBurp] = useState(false);
    const [needsFeed, setFeed] = useState(false);
    const [hoursBetweenBurps, setHoursBetweenBurps] = useState(0);
    const [hoursBetweenFeeds, setHoursBetweenFeeds] = useState(0);
    const [feedMaterials, setFeedMaterials] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [status, setStatus] = useState('');
    const [done, setDone] = useState(false);

    store.subscribe(() => {
        const currentProject = store.getState().projects.currentlyViewedProject;

        console.log(currentProject);
        if (Object.keys(currentProject).length > 0) {
            setProjectName(currentProject.name);
            setStatus(currentProject.status);
            setNotes(currentProject.notes);
            setBurp(currentProject.burpHours > 0);
            setHoursBetweenBurps(currentProject.burpHours);
            setFeed(currentProject.feedHours > 0);
            setHoursBetweenFeeds(currentProject.feedHours);
            setFeedMaterials(currentProject.feedMaterial);
            setDone(currentProject.done);
            setStartDate(currentProject.startDate);
            setEndDate(currentProject.doneDate);
            setModalOpen(true);
        }
    });
    
    const handleSubmit = () => {
        const documentID = store.getState().projects.currentlyViewedProject.documentID;

        const project = {
            name: projectName,
            owner: store.getState().auth.email,
            status: status,
            startDate: startDate,
            doneDate: endDate ? endDate : null,
            burpHours: hoursBetweenBurps,
            feedHours: hoursBetweenFeeds,
            feedMaterial: feedMaterials,
            notes: notes,
            done: done,
            documentID: documentID
        }

        firebase.firestore().doc('projects/' + documentID).set(project).then((response) => {
            setModalOpen(false);
            dispatch(updateProject(project, documentID));
        }, (error) => {
            console.log(error);
        });
    }

    return (
        <div>
            <Modal show={modalOpen}>
                <Modal.Header>
                    <Modal.Title>Edit: {projectName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Control  value={projectName} onChange={(event: React.FormEvent) => { setProjectName((event.currentTarget as any).value )}} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control value={status} as="select" placeholder="Current status..." onChange={(event: React.FormEvent) => { setStatus((event.currentTarget as any).value )}}>
                                <option>Fermenting</option>
                                <option>Bottled/2F</option>
                                <option>Cold Rest</option>
                                <option>Curing</option>
                                <option>Dead</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Start Date: {formatDate(startDate)}</Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>End Date (Optional)</Form.Label>
                            <Form.Control type="text" defaultValue={endDate ? formatDate(endDate) : ''} onChange={(event: React.FormEvent) => { setEndDate((event.currentTarget as any).value) }}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Check checked={needsBurp} type="checkbox" label="Needs Regular Burping" onChange={(event: React.FormEvent) => { setBurp(!needsBurp)}}></Form.Check>
                            { needsBurp ? 
                                <Form.Control value={hoursBetweenBurps > 0 ? hoursBetweenFeeds.toString() : ''} placeholder="Number of hours between burps" type="number" onChange={(event: React.FormEvent) => { setHoursBetweenBurps((event.currentTarget as any).value) }}></Form.Control> : ''
                            }
                            <Form.Check checked={needsFeed} type="checkbox" label="Needs Regular Feeding" onChange={(event: React.FormEvent) => { setFeed(!needsFeed)}}></Form.Check>
                            { needsFeed ?
                                <div>
                                    <Form.Control defaultValue={hoursBetweenFeeds > 0 ? hoursBetweenFeeds.toString() : ''} placeholder="Number of hours between feeds..." type="number" onChange={(event: React.FormEvent) => { setHoursBetweenFeeds((event.currentTarget as any).value) }}></Form.Control>
                                    <Form.Control value={feedMaterials} placeholder="Feed material..." onChange={(event: React.FormEvent) => { setFeedMaterials((event.currentTarget as any).value) }}></Form.Control>
                                </div> : ''
                            }
                        </Form.Group>
                        <Form.Group>
                            <Form.Control value={notes} as="textarea" placeholder="Additional notes..." onChange={(event: React.FormEvent) => { setNotes((event.currentTarget as any).value )}} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" type="submit" onClick={() => { setModalOpen(false) }}>Close</Button>
                    <Button variant="danger" onClick={() => { setDone(!done)}}>
                        { done ? 'Mark Un-done' : 
                        <span>
                            Mark Done <FontAwesomeIcon icon={faCheck as IconProp}></FontAwesomeIcon>
                        </span>
                         }
                        </Button>
                    <Button variant="success" onClick={handleSubmit}>Update Project</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ModifyProjectModal;