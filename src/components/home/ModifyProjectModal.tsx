import { Modal, Button, FormControl, Form, Card} from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import firebase, { firestore } from 'firebase';
import { store } from '../../index';
import { useDispatch } from 'react-redux';
import { createNewProject, updateProject } from '../../redux/actions/ProjectActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCheck } from '@fortawesome/fontawesome-free-solid';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { formatDate, convertSecondsToProperFormat, convertUnitsToSeconds } from '../../utility/helper';

const ModifyProjectModal = () => {
    const [dispatch, setDispatch] = useState(useDispatch);
    const [modalOpen, setModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [notes, setNotes] = useState('');
    const [needsBurp, setBurp] = useState(false);
    const [needsFeed, setFeed] = useState(false);
    const [feedMaterials, setFeedMaterials] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [status, setStatus] = useState('');
    const [done, setDone] = useState(false);
    const [feedTimeUnits, setFeedTimeUnits] = useState('Hour(s)');
    const [feedTimeValue, setFeedTimeValue] = useState(0);
    const [burpTimeUnits, setBurpTimeUnits] = useState('Hour(s)');
    const [burpTimeValue, setBurpTimeValue] = useState(0);
    const [lastFeedTime, setLastFeedTime] = useState(0);
    const [lastBurpTime, setLastBurpTime] = useState(0);
    const [initialNeedsFeed, setInitialNeedsFeed] = useState(false); // Use this in case the user decides to add feed time after it wasn't already there.
    const [initialNeedsBurp, setInitialNeedsBurp] = useState(false);

    store.subscribe(() => {
        const currentProject = store.getState().projects.currentlyViewedProject;

        console.log(currentProject);
        if (Object.keys(currentProject).length > 0) {
            setProjectName(currentProject.name);
            setStatus(currentProject.status);
            setNotes(currentProject.notes);
            setBurp(currentProject.burpTime > 0);
            setFeed(currentProject.feedTime > 0);
            setInitialNeedsBurp(currentProject.burpTime > 0);
            setInitialNeedsFeed(currentProject.feedTime > 0);
            setFeedMaterials(currentProject.feedMaterial);
            setDone(currentProject.done);
            setStartDate(currentProject.startDate);
            setEndDate(currentProject.doneDate);
            setFeedTimeUnits(convertSecondsToProperFormat(currentProject.feedTime).unit);
            setFeedTimeValue(convertSecondsToProperFormat(currentProject.feedTime).value);
            setBurpTimeUnits(convertSecondsToProperFormat(currentProject.burpTime).unit);
            setBurpTimeValue(convertSecondsToProperFormat(currentProject.burpTime).value);
            setLastFeedTime(currentProject.lastFeedTime);
            setLastBurpTime(currentProject.lastBurpTime);
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
            burpTime: needsBurp ? convertUnitsToSeconds(burpTimeValue, burpTimeUnits) : 0,
            feedTime: needsFeed ? convertUnitsToSeconds(feedTimeValue, feedTimeUnits) : 0,
            lastFeedTime: needsFeed ? ((!initialNeedsFeed) ? Date.now() : lastFeedTime) : 0,
            lastBurpTime: needsBurp ? ((!initialNeedsBurp) ? Date.now() : lastBurpTime) : 0,
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
                                <option>Done</option>
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
                            <Form.Check type="checkbox" defaultChecked={needsBurp} label="Needs Regular Burping" onChange={(event: React.FormEvent) => { setBurp(!needsBurp)}}></Form.Check>
                            { needsBurp ? 
                                <div>
                                    <Form.Control placeholder="Number" type="number" defaultValue={burpTimeValue} onChange={(event: React.FormEvent) => { setBurpTimeValue((event.currentTarget as any).value) }}></Form.Control>
                                    <Form.Control as="select" value={burpTimeUnits} onChange={(event: React.FormEvent) => { setBurpTimeUnits((event.currentTarget as any).value )}}>
                                        <option>Hour(s)</option>
                                        <option>Day(s)</option>
                                        <option>Week(s)</option>
                                    </Form.Control>
                                </div>
                                : ''
                            }
                            <Form.Check type="checkbox" defaultChecked={needsFeed} label="Needs Regular Feeding" onChange={(event: React.FormEvent) => { setFeed(!needsFeed)}}></Form.Check>
                            { needsFeed ?
                                <div>
                                    <Form.Control placeholder="Number" type="number" defaultValue={feedTimeValue} onChange={(event: React.FormEvent) => { setFeedTimeValue((event.currentTarget as any).value) }}></Form.Control>
                                    <Form.Control as="select" value={feedTimeUnits} onChange={(event: React.FormEvent) => { setFeedTimeUnits((event.currentTarget as any).value )}}>
                                        <option>Hour(s)</option>
                                        <option>Day(s)</option>
                                        <option>Week(s)</option>
                                    </Form.Control>
                                    <Form.Control placeholder="Feed material..." onChange={(event: React.FormEvent) => { setFeedMaterials((event.currentTarget as any).value) }}></Form.Control>
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