import { useState } from "react";
import { useDispatch } from "react-redux";
import React from "react";
import { Button, Modal, Form, InputGroup } from "react-bootstrap";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { store } from "../..";
import firebase from "firebase";
import { createNewRecipe, updateRecipe } from '../../redux/actions/RecipeActions';
import { updateProject } from "../../redux/actions/ProjectActions";
import { splitIngredientsIntoList } from '../../utility/helper';

const ModifyRecipeModal = () => {
    const [dispatch, setDispatch] = useState(useDispatch);
    const [modalOpen, setModalOpen] = useState(false);
    const [recipeName, setRecipeName] = useState('');
    const [recipeTime, setRecipeTime] = useState('');
    const [numberOfIngredients, setNumberOfIngredients] = useState(0);
    const [ingredients, setIngredients] = useState([] as string[]);
    const [hiddenIngredients, setHiddenIngredients] = useState([] as number[]);
    const [instructions, setInstructions] = useState('');

    store.subscribe(() => {
        const currentRecipe = store.getState().recipes.currentlyViewedRecipe;
        const recipeIngredients = splitIngredientsIntoList(currentRecipe.ingredients);

        console.log('HELP');
        console.log(currentRecipe);
        setHiddenIngredients([]);

        if (Object.keys(currentRecipe).length > 0) {
            setRecipeName(currentRecipe.name);
            setRecipeTime(currentRecipe.time);
            setInstructions(currentRecipe.instructions);
            setIngredients(recipeIngredients);
            setNumberOfIngredients(recipeIngredients.length)
            setModalOpen(true);
        }
    });

    const handleSubmit = () => {
        let ingredientString = '';
        let ingredientCount = 0;
        ingredients.forEach((ingredient, i) => {
            if (!hiddenIngredients.includes(i)) {
                ingredientString += ingredient + ':::';
                ingredientCount++;
            }
        });

        const recipe = {
            name: recipeName,
            time: recipeTime,
            owner: store.getState().auth.email,
            ingredientCount: ingredientCount,
            ingredients: ingredientString,
            instructions: instructions,
            documentID: store.getState().recipes.currentlyViewedRecipe.documentID
        }

        firebase.firestore().doc('recipes/' +  recipe.documentID).set(recipe).then((response) => {
            dispatch(updateRecipe(recipe, recipe.documentID));
            setModalOpen(false);
        });
    }

    const addIngredientToList = (index: number, ingredient: string) => {
        let newIngredients: string[] = ingredients.slice();
        newIngredients[index] = ingredient;
        setIngredients(newIngredients);
    }

    const deleteIngredient = (index: number) => {
        setHiddenIngredients([...hiddenIngredients, index]);
    }

    return (
        <div>
            <Modal show={modalOpen}>
                <Modal.Header>
                    <Modal.Title>Edit: {recipeName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label><b>Recipe Name</b></Form.Label>
                            <Form.Control value={recipeName} placeholder="Enter recipe name..." onChange={(event: React.FormEvent) => { setRecipeName((event.target as any).value) }}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label><b>Time Required</b></Form.Label>
                            <Form.Control value={recipeTime} placeholder="Enter amount of time..." onChange={(event: React.FormEvent) => { setRecipeTime((event.target as any).value) }}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label><b>Ingredients</b></Form.Label>
                            <Button className="ml-2" variant="outline-primary" onClick={() => setNumberOfIngredients(numberOfIngredients + 1)}><FontAwesomeIcon icon={faPlus as IconProp}></FontAwesomeIcon></Button>
                            { [...Array(numberOfIngredients)].map((e, i) =>
                                <div>
                                    { !hiddenIngredients.includes(i) ?
                                    <InputGroup key={i} className="my-1">
                                        <Form.Control value={ingredients[i]} placeholder="Enter ingredient quantity and type..." onChange={(event: React.FormEvent) => addIngredientToList(i, (event.target as any).value)}></Form.Control>
                                        <InputGroup.Append>
                                            <Button variant="outline-danger" className="float-right" onClick={() => deleteIngredient(i)}><FontAwesomeIcon icon={faTrash as IconProp}></FontAwesomeIcon></Button>
                                        </InputGroup.Append>
                                    </InputGroup> : ''
                                    }
                                </div>
                            )}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label><b>Instructions</b></Form.Label>
                            <Form.Control value={instructions} placeholder="Enter instructions..." as="textarea" onChange={(event: React.FormEvent) => { setInstructions((event.target as any).value) }}></Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setModalOpen(false) }}>Close</Button>
                    <Button variant="success" onClick={handleSubmit}>Update Recipe</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ModifyRecipeModal;