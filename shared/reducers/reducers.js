import { ADD_TODO, COMPLETE_TODO, SELECT_TODO } from '../actions'

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
            return [
                ...state.slice(0, action.index),
                Object.assign({}, state[action.index], {
                  completed: !state[action.index].completed
                }),
                ...state.slice(action.index + 1)
              ];
        case SELECT_TODO:
            let index = isNaN(action.index)
                        ? state.findIndex((todo) => todo.text.toLowerCase().replace(/\s/g, '-') === action.index)   
                        : action.index,
                current = state.findIndex((todo) => todo.selected);
            if (current === index) return state;
            let newState = [
                ...state.slice(0, index),
                Object.assign({}, state[index], {
                  selected: true
                }),
                ...state.slice(index + 1)
              ];
            for (let i in newState) {
                if (i != index) {
                    newState[i].selected = false;
                }
            }
            return newState;
        default:
            return state;
    }
}