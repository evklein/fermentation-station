import React, { FormEvent, useState, useEffect } from 'react';
import { Container, Row, Col, Card, ButtonGroup, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { store } from '../..';
import { Redirect } from 'react-router-dom';
import { deleteAllRecipes, createNewRecipe, deleteRecipe } from '../../redux/actions/RecipeActions';
import CreateRecipeModal from './CreateRecipeModal';
import firebase from 'firebase';
import { faClock, faList, faAngleDown, faAngleRight, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const Recipes = () => {
    const [dispatch, setDispatch] = useState(useDispatch);
    const [userRecipes, setUserRecipes] = useState([] as firebase.firestore.DocumentData[]);
    const [openRecipe, setOpenRecipe] = useState({} as firebase.firestore.DocumentData);

    useEffect(() => {
        dispatch(deleteAllRecipes());
        initializeRecipes();
    }, []);

    const initializeRecipes = () => {
        firebase.firestore().collection('recipes').where('owner', '==', store.getState().auth.email).get().then((response) => {
            response.forEach((document) => {
                const documentData = document.data();
                documentData.documentID = document.id;
                dispatch(createNewRecipe(documentData));
            });

            setUserRecipes(store.getState().recipes.userRecipes);
        })
    }

    const changeOpenRecipe = (recipe: firebase.firestore.DocumentData) => {
        if (openRecipe.documentID === recipe.documentID) {
            setOpenRecipe({});
        } else {
            setOpenRecipe(recipe);
        }
    }

    const splitIngredientsIntoList = (ingredientsString: string) => {
        let splitArray = ingredientsString.split(':::');
        return splitArray.slice(0, splitArray.length - 1);
    }

    const editRecipe = (event: React.FormEvent, recipe: firebase.firestore.DocumentData) => {
        event.stopPropagation();
    }

    const deleteRecipeItem = (recipe: firebase.firestore.DocumentData) => {
        firebase.firestore().doc('recipes/' + recipe.documentID).delete().then((response) => {
            dispatch(deleteRecipe(recipe, recipe.documentID));
        })
    }

    store.subscribe(() => {
        setUserRecipes(store.getState().recipes.userRecipes);
    });

    return (
        <Container fluid>
            { !store.getState().auth.isLoggedIn ? <Redirect to="/sign-in"></Redirect> : ''}
            <Row className="ml-2">
                <CreateRecipeModal></CreateRecipeModal>
            </Row>
            <Row className="ml-2">
                { userRecipes.length === 0 ?
                    <h2>0 recipes found</h2> : ''
                }
            </Row>
            <Row noGutters>
                { userRecipes.map((recipe: firebase.firestore.DocumentData) => 
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
                                        <Button variant="danger" onClick={() => deleteRecipeItem(recipe)}>
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
        </Container>
    )
}

export default Recipes;