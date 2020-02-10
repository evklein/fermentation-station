import { Modal, Button, FormControl, Form, Card} from 'react-bootstrap';
import React, { useState } from 'react';
import firebase from 'firebase';
import { store } from '../../index';
import { useDispatch } from 'react-redux';
import { createNewProject } from '../../redux/actions/ProjectActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { convertUnitsToSeconds } from '../../utility/helper';

const CreateProjectModal = () => {
    const [dispatch, setDispatch] = useState(useDispatch);
    const [modalOpen, setModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [notes, setNotes] = useState('');
    const [needsBurp, setBurp] = useState(false);
    const [needsFeed, setFeed] = useState(false);
    const [feedMaterials, setFeedMaterials] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date('01-01-1900'));
    const [status, setStatus] = useState('Fermentation');
    const [feedTimeUnits, setFeedTimeUnits] = useState('Hour(s)');
    const [feedTimeValue, setFeedTimeValue] = useState(0);
    const [burpTimeUnits, setBurpTimeUnits] = useState('Hour(s)');
    const [burpTimeValue, setBurpTimeValue] = useState(0);

    
    const handleSubmit = () => {
        const project = {
            name: projectName,
            owner: store.getState().auth.email,
            status: status,
            startDate: startDate,
            doneDate: endDate.toLocaleDateString() !== '1/1/1900' ? endDate : null, // If end date hasn't been set then don't send it.
            burpTime: needsBurp ? convertUnitsToSeconds(burpTimeValue, burpTimeUnits) : '',
            lastBurpTime: needsBurp ? Date.now() : '',
            feedTime: needsFeed ? convertUnitsToSeconds(feedTimeValue, feedTimeUnits) : '',
            lsatFeedTime: needsFeed ? Date.now() : '',
            feedMaterial: feedMaterials,
            notes: notes,
            done: false,
            documentID: ''
        }

        console.log(project);

        firebase.firestore().collection('projects').add(project).then((response) => {
            project.documentID = response.id;
            dispatch(createNewProject(project));
            setModalOpen(false);
            cleanUpForm();
        });
    }

    const cleanUpForm = () => {
        setBurp(false);
        setFeed(false);
    }

    return (
        <div>
            <Card style={{width: '18rem'}} onClick={() => { setModalOpen(true) }}>
                <Card.Body>
                    <Card.Text>Create New Project +</Card.Text>
                </Card.Body>
            </Card>
            <Modal show={modalOpen}>
                <Modal.Header>
                    <Modal.Title>Create a New Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Control placeholder="Project name" onChange={(event: React.FormEvent) => { setProjectName((event.currentTarget as any).value )}} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control as="select" placeholder="Current status..." onChange={(event: React.FormEvent) => { setStatus((event.currentTarget as any).value )}}>
                                <option>Fermenting</option>
                                <option>Bottled/2F</option>
                                <option>Cold Rest</option>
                                <option>Curing</option>
                                <option>Dead</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control type="datetime-local" onChange={(event: React.FormEvent) => { setStartDate(new Date((event.target as any).value)) }}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>End Date (Optional)</Form.Label>
                            <Form.Control type="datetime-local" onChange={(event: React.FormEvent) => { setEndDate(new Date((event.target as any).value)) }}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Check type="checkbox" label="Needs Regular Burping" onChange={(event: React.FormEvent) => { setBurp(!needsBurp)}}></Form.Check>
                            { needsBurp ? 
                                <div>
                                    <Form.Control placeholder="Number" type="number" onChange={(event: React.FormEvent) => { setBurpTimeValue((event.currentTarget as any).value) }}></Form.Control>
                                    <Form.Control as="select" onChange={(event: React.FormEvent) => { setBurpTimeUnits((event.currentTarget as any).value )}}>
                                        <option>Hour(s)</option>
                                        <option>Day(s)</option>
                                        <option>Week(s)</option>
                                    </Form.Control>
                                </div>
                                : ''
                            }
                            <Form.Check type="checkbox" label="Needs Regular Feeding" onChange={(event: React.FormEvent) => { setFeed(!needsFeed)}}></Form.Check>
                            { needsFeed ?
                                <div>
                                    <Form.Control placeholder="Number" type="number" onChange={(event: React.FormEvent) => { setFeedTimeValue((event.currentTarget as any).value) }}></Form.Control>
                                    <Form.Control as="select" onChange={(event: React.FormEvent) => { setFeedTimeUnits((event.currentTarget as any).value )}}>
                                        <option>Hour(s)</option>
                                        <option>Day(s)</option>
                                        <option>Week(s)</option>
                                    </Form.Control>
                                    <Form.Control placeholder="Feed material..." onChange={(event: React.FormEvent) => { setFeedMaterials((event.currentTarget as any).value) }}></Form.Control>
                                </div> : ''
                            }
                        </Form.Group>
                        <Form.Group>
                            <Form.Control as="textarea" placeholder="Additional notes..." onChange={(event: React.FormEvent) => { setNotes((event.currentTarget as any).value )}} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" type="submit" onClick={() => { setModalOpen(false) }}>Close</Button>
                    <Button variant="success" onClick={handleSubmit}>Create Project</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CreateProjectModal;