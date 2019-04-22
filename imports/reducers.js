import { EditorState } from 'draft-js';
import {
  ADD_PARAGRAPH_TO_EDITING_QUIZ,
  CHANGE_PARAGRAPH_EDITOR_STATE_IN_EDITING_QUIZ,
  REMOVE_PARAGRAPH_FROM_EDITING_QUIZ
} from './actions';
import omit from 'lodash/omit';
import pull from 'lodash/pull';
import max from 'lodash/max';

function editingQuizParagraphReducer(state = { byId: {}, allIds: [] }, action) {
  const newId = (max(state.allIds) || 0) + 1;

  switch (action.type) {
    case ADD_PARAGRAPH_TO_EDITING_QUIZ:
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

    case CHANGE_PARAGRAPH_EDITOR_STATE_IN_EDITING_QUIZ:
      return {
        ...state,

        byId: {
          ...state.byId,

          [action.id]: {
            editorState: action.state
          }
        }
      };

    case REMOVE_PARAGRAPH_FROM_EDITING_QUIZ:
      return {
        ...state,
        byId: omit(state.byId, action.id),
        allIds: pull(state.allIds, action.id)
      };

    default:
      return state;
  }
}

function editingQuizReducer(state = {}, action) {
  return {
    ...state,
    paragraphs: editingQuizParagraphReducer(state.paragraphs, action)
  }
}

const reducers = (state = {}, action) => {
  return {
    ...state,
    editingQuiz: editingQuizReducer(state.editingQuiz, action)
  }
};

export default reducers;