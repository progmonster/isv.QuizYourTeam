import { EditorState } from 'draft-js';
import { ADD_PARAGRAPH, CHANGE_PARAGRAPH_EDITOR_STATE } from './actions';
import { combineReducers } from "redux";
import size from 'lodash/size';

function paragraphs(state = { byId: {}, allIds: [] }, action) {
  switch (action.type) {
    case ADD_PARAGRAPH:
      return {
        ...state,

        byId: {
          ...state.byId,

          [size(state.byId)]: {
            editorState: EditorState.createEmpty()
          }
        },

        allIds: [...state.allIds, size(state.byId)]
      };

    case CHANGE_PARAGRAPH_EDITOR_STATE:
      return {
        ...state,

        byId: {
          ...state.byId,

          [action.paragraphNumber - 1]: {
            editorState: action.state
          }
        }
      };

    default:
      return state;
  }
}

const reducers = combineReducers({ paragraphs });

export default reducers;