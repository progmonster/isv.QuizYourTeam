import { EditorState } from 'draft-js';
import { ADD_PARAGRAPH, CHANGE_PARAGRAPH_EDITOR_STATE, REMOVE_PARAGRAPH } from './actions';
import { combineReducers } from "redux";
import omit from 'lodash/omit';
import pull from 'lodash/pull';
import max from 'lodash/max';

function paragraphs(state = { byId: {}, allIds: [] }, action) {
  const newId = (max(state.allIds) || 0) + 1;

  switch (action.type) {
    case ADD_PARAGRAPH:
      return {
        ...state,

        byId: {
          ...state.byId,

          [newId]: {
            editorState: EditorState.createEmpty()
          }
        },

        allIds: [...state.allIds, newId]
      };

    case CHANGE_PARAGRAPH_EDITOR_STATE:
      return {
        ...state,

        byId: {
          ...state.byId,

          [action.id]: {
            editorState: action.state
          }
        }
      };

    case REMOVE_PARAGRAPH:
      return {
        ...state,
        byId: omit(state.byId, action.id),
        allIds: pull(state.allIds, action.id)
      };

    default:
      return state;
  }
}

const reducers = combineReducers({ paragraphs });

export default reducers;