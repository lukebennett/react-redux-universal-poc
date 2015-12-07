import { ADD_TODO, COMPLETE_TODO } from '../actions'

const initialState = [];

export function todos(state = initialState, action) {
    switch (action.type) {
        case ADD_TODO:
            return [
                ...state,
                {
                    text: action.text,
                    completed: false
                }
            ]
        case COMPLETE_TODO:
            return state;
        default:
            return state;
    }
}