import React, { FormEvent, useState, useEffect } from 'react';
import { Container, Row, Col, Card, ButtonGroup, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { store } from '../..';
import { Redirect } from 'react-router-dom';
import { deleteAllRecipes, createNewRecipe, deleteRecipe, viewRecipe } from '../../redux/actions/RecipeActions';
import CreateRecipeModal from './CreateRecipeModal';
import firebase from 'firebase';
import { faClock, faList, faAngleDown, faAngleRight, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import ModifyProjectModal from '../home/ModifyProjectModal';
import ModifyRecipeModal from './ModifyRecipeModal';
import { splitIngredientsIntoList, compareObjectNames } from '../../utility/helper';
import { faSync } from '@fortawesome/fontawesome-free-solid';

const Recipes = () => {
    const [dispatch, setDispatch] = useState(useDispatch);
    const [userRecipes, setUserRecipes] = useState([] as firebase.firestore.DocumentData[]);
    const [openRecipe, setOpenRecipe] = useState({} as firebase.firestore.DocumentData);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        dispatch(deleteAllRecipes());
        initializeRecipes();
    }, []);

    const initializeRecipes = () => {
        setIsLoading(true);
        firebase.firestore().collection('recipes').where('owner', '==', store.getState().auth.email).get().then((response) => {
            response.forEach((document) => {
                const documentData = document.data();
                documentData.documentID = document.id;
                dispatch(createNewRecipe(documentData));
            });

            setUserRecipes(store.getState().recipes.userRecipes);
            setIsLoading(false);
        })
    }

    const changeOpenRecipe = (recipe: firebase.firestore.DocumentData) => {
        if (openRecipe.documentID === recipe.documentID) {
            setOpenRecipe({});
        } else {
            setOpenRecipe(recipe);
        }
    }

    const editRecipe = (event: React.FormEvent, recipe: firebase.firestore.DocumentData) => {
        event.stopPropagation();
        event.preventDefault();
        
        dispatch(viewRecipe(recipe));
    }

    const deleteRecipeItem = (event: React.FormEvent, recipe: firebase.firestore.DocumentData) => {
        event.stopPropagation();
        event.preventDefault();
        firebase.firestore().doc('recipes/' + recipe.documentID).delete().then((response) => {
            dispatch(deleteRecipe(recipe, recipe.documentID));
        });
    }

    store.subscribe(() => {
        setUserRecipes(store.getState().recipes.userRecipes);
    });


    return (
        <Container fluid>
            { !store.getState().auth.isLoggedIn ? <Redirect to="/sign-in"></Redirect> : ''}
            <Row className="ml-2">
                <CreateRecipeModal></CreateRecipeModal>
                <Form style={{width: '350px'}}>
                    <Form.Control className="mt-2 ml-2" type="text" placeholder="Search recipes" onChange={(event: React.FormEvent) => setSearchText((event.target as any).value)}></Form.Control>
                </Form>
            </Row>
            <Row className="ml-2">
                { !isLoading ?
                <div>
                    { userRecipes.length === 0 ?
                        <h2>0 recipes found</h2> : ''
                    } 
                </div> : <h2><FontAwesomeIcon icon={faSync as IconProp} spin></FontAwesomeIcon></h2>
                }  
            </Row>
            <Row noGutters>
                { userRecipes.sort(compareObjectNames).filter((recipe) => { return recipe.name.toLowerCase().includes(searchText.toLowerCase()) }).map((recipe: firebase.firestore.DocumentData) => 
                <Col>
                    <Card style={{ width: '50rem' }} className="mt-2 mx-2 mb-2" onClick={() => changeOpenRecipe(recipe)}>
                        <Card.Body>
                            <Card.Title>
                                { openRecipe.documentID === recipe.documentID ? 
                                    <FontAwesomeIcon icon={faAngleDown as IconProp}></FontAwesomeIcon> :
                                    <FontAwesomeIcon icon={faAngleRight as IconProp}></FontAwesomeIcon>
                                }
                                {' '}{ recipe.name }
                                    <ButtonGroup className="float-right">
                                        <Button variant="info" onClick={(event: React.FormEvent) => editRecipe(event, recipe)}>
                                            <FontAwesomeIcon icon={faPencilAlt as IconProp}></FontAwesomeIcon>
                                        </Button>
                                        <Button variant="danger" onClick={(event: React.FormEvent) => deleteRecipeItem(event, recipe)}>
                                            <FontAwesomeIcon icon={faTrash as IconProp}></FontAwesomeIcon>
                                        </Button>
                                    </ButtonGroup>
                            </Card.Title>
                            <Card.Text>
                                <FontAwesomeIcon icon={faClock as IconProp}></FontAwesomeIcon>
                                {' '}{ recipe.time ? recipe.time : 'N/A' }<br/>

                                <FontAwesomeIcon icon={faList as IconProp}></FontAwesomeIcon>
                                {' '}{ recipe.ingredientCount ? <span>{recipe.ingredientCount} ingredient(s) needed</span> : 'No ingredients needed' }<br/>

                                { openRecipe.documentID === recipe.documentID ?
                                    <div>
                                        { recipe.ingredientCount ? 
                                            <ul>
                                                { splitIngredientsIntoList(recipe.ingredients).map((ingredient: string) => 
                                                    <li>{ ingredient }</li>
                                                )}
                                            </ul>: ''
                                        }
                                        <h6>Instructions</h6>
                                        { recipe.instructions ? recipe.instructions : 'No instructions found.' }
                                    </div> : ''
                                }
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                )}
            </Row>
            <ModifyRecipeModal></ModifyRecipeModal>
        </Container>
    )
}

export default Recipes;