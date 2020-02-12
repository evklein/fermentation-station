import React, { FormEvent, useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { store } from '../..';
import { Redirect } from 'react-router-dom';
import { deleteAllRecipes, createNewRecipe } from '../../redux/actions/RecipeActions';
import CreateRecipeModal from './CreateRecipeModal';
import firebase from 'firebase';

const Recipes = () => {
    const [dispatch, setDispatch] = useState(useDispatch);
    const [userRecipes, setUserRecipes] = useState([] as firebase.firestore.DocumentData[]);

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

    store.subscribe(() => {
        setUserRecipes(store.getState().recipes.userRecipes);
    })

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
                    <Card style={{ width: '18rem' }} className="mt-2 mx-2 mb-2">
                        <Card.Body>
                            <Card.Title>{ recipe.name }</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
                )}
            </Row>
        </Container>
    )
}

export default Recipes;