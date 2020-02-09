import { Modal, Button, FormControl, Form, Card} from 'react-bootstrap';
import React, { useState } from 'react';
import firebase from 'firebase';

const CreateProjectModal = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [notes, setNotes] = useState('');
    const [needsBurp, setBurp] = useState(false);
    const [needsFeed, setFeed] = useState(false);
    const [hoursBetweenBurps, setHoursBetweenBurps] = useState(0);
    const [hoursBetweenFeeds, setHoursBetweenFeeds] = useState(0);
    const [feedMaterials, setFeedMaterials] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState();
    
    const handleSubmit = () => {
        firebase.firestore().collection('projects').add({
            
        });
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
                            <Form.Control as="select" placeholder="Current status...">
                                <option>Fermenting</option>
                                <option>Bottled (2F)</option>
                                <option>Cold Rest</option>
                                <option>Curing</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control type="date" onChange={(event: React.FormEvent) => { setStartDate((event.target as any).value)}}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>End Date</Form.Label>
                            <Form.Control type="date" placeholder="(Optional)"></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Check type="checkbox" label="Needs Regular Burping" onChange={(event: React.FormEvent) => { setBurp(!needsBurp)}}></Form.Check>
                            { needsBurp ? 
                                <Form.Control placeholder="Number of hours between burps" type="number"></Form.Control> : ''
                            }
                            <Form.Check type="checkbox" label="Needs Regular Feeding" onChange={(event: React.FormEvent) => { setFeed(!needsFeed)}}></Form.Check>
                            { needsFeed ?
                                <div>
                                    <Form.Control placeholder="Number of hours between feeds..." type="number"></Form.Control>
                                    <Form.Control placeholder="Feed material..."></Form.Control>
                                </div> : ''
                            }
                        </Form.Group>
                        <Form.Group>
                            <Form.Control as="textarea" placeholder="Additional notes..." onChange={(event: React.FormEvent) => { setNotes((event.currentTarget as any).value )}} />
                        </Form.Group>
                    </Form>
                    {/* <FormControl placeholder="Project name"></FormControl>
                    // For dates: https://www.npmjs.com/package/react-bootstrap-date-picker
                    <FormControl placeholder="Additional notes..."></FormControl>
                    <Form.Check>Needs Regular Feeding</Form.Check>
                    <Form.Check>Needs Regular Burping</Form.Check> */}
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