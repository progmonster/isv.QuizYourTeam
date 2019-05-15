import { EditorState } from 'draft-js';
import omit from 'lodash/omit';
import pull from 'lodash/pull';
import max from 'lodash/max';
import reduce from 'lodash/reduce';
import { combineReducers } from 'redux';
import { SINGLE_CHOICE } from '../model/answerTypes';
import {
  ADD_ANSWER_TO_EDITING_QUIZ,
  ADD_PARAGRAPH_TO_EDITING_QUIZ,
  ADD_QUESTION_TO_EDITING_QUIZ,
  CHANGE_ANSWER_CHECK_STATE_IN_EDITING_QUIZ,
  CHANGE_ANSWER_TITLE_IN_EDITING_QUIZ,
  CHANGE_ANSWER_TYPE_IN_EDITING_QUIZ,
  CHANGE_DESCRIPTION_EDITOR_STATE_IN_EDITING_QUIZ,
  CHANGE_PARAGRAPH_EDITOR_STATE_IN_EDITING_QUIZ,
  CHANGE_QUESTION_EDITOR_STATE_IN_EDITING_QUIZ,
  CHANGE_TITLE_IN_EDITING_QUIZ,
  CLEAR_EDITING_QUIZ,
  convertQuizForStore,
  REMOVE_ANSWER_FROM_EDITING_QUIZ,
  REMOVE_PARAGRAPH_FROM_EDITING_QUIZ,
  REMOVE_QUESTION_FROM_EDITING_QUIZ,
  SAVE_EDITING_QUIZ,
  SET_EDITING_QUIZ,
} from './actions';
import { snackbarReducer } from './components/snackbar';

function editingQuizParagraphReducer(state = {
  byId: {},
  allIds: [],
}, action) {
  const newId = (max(state.allIds) || 0) + 1;

  switch (action.type) {
    case ADD_PARAGRAPH_TO_EDITING_QUIZ:
      return {
        ...state,

        byId: {
          ...state.byId,

          [newId]: {
            editorState: EditorState.createEmpty(),
          },
        },

        allIds: [...state.allIds, newId],
      };

    case CHANGE_PARAGRAPH_EDITOR_STATE_IN_EDITING_QUIZ:
      return {
        ...state,

        byId: {
          ...state.byId,

          [action.id]: {
            ...state.byId[action.id],
            editorState: action.state,
          },
        },
      };

    case REMOVE_PARAGRAPH_FROM_EDITING_QUIZ:
      return {
        ...state,
        byId: omit(state.byId, action.id),
        allIds: pull(state.allIds, action.id),
      };

    default:
      return state;
  }
}

function editingQuizAnswerReducer(state = {
  byId: {},
  allIds: [],
}, answerType, action) {
  switch (action.type) {
    case ADD_ANSWER_TO_EDITING_QUIZ:
      const newAnswerId = (max(state.allIds) || 0) + 1;

      return {
        ...state,

        byId: {
          ...state.byId,

          [newAnswerId]: {
            title: action.title,
            checked: action.checked,
          },
        },

        allIds: [...state.allIds, newAnswerId],
      };

    case CHANGE_ANSWER_TITLE_IN_EDITING_QUIZ:
      return {
        ...state,

        byId: {
          ...state.byId,

          [action.answerId]: {
            ...state.byId[action.answerId],
            title: action.title,
          },
        },
      };

    case REMOVE_ANSWER_FROM_EDITING_QUIZ:
      return {
        ...state,

        byId: omit(state.byId, action.answerId),
        allIds: pull(state.allIds, action.answerId),
      };

    case CHANGE_ANSWER_CHECK_STATE_IN_EDITING_QUIZ:
      return {
        ...state,

        byId: reduce(state.byId, (acc, answer, answerId) => {
          acc[answerId] = { ...answer };

          if (Number(answerId) === action.answerId) {
            acc[answerId].checked = action.checked;
          } else if (answerType === SINGLE_CHOICE && action.checked) {
            acc[answerId].checked = false;
          }

          return acc;
        }, {}),
      };

    case CHANGE_ANSWER_TYPE_IN_EDITING_QUIZ:
      return {
        ...state,

        byId: reduce(state.byId, (acc, answer, answerId) => {
          acc[answerId] = {
            ...answer,
            checked: false,
          };

          return acc;
        }, {}),
      };

    default:
      return state;
  }
}

function editingQuizQuestionReducer(state = {
  byId: {},
  allIds: [],
}, action) {
  let question;

  switch (action.type) {
    case ADD_QUESTION_TO_EDITING_QUIZ:
      const newQuestionId = (max(state.allIds) || 0) + 1;

      return {
        ...state,

        byId: {
          ...state.byId,

          [newQuestionId]: {
            editorState: EditorState.createEmpty(),
            answerType: SINGLE_CHOICE,
            answers: {
              allIds: [],
              byId: {},
            },
          },
        },

        allIds: [...state.allIds, newQuestionId],
      };

    case CHANGE_QUESTION_EDITOR_STATE_IN_EDITING_QUIZ:
      return {
        ...state,

        byId: {
          ...state.byId,

          [action.id]: {
            ...state.byId[action.id],
            editorState: action.state,
          },
        },
      };

    case REMOVE_QUESTION_FROM_EDITING_QUIZ:
      return {
        ...state,
        byId: omit(state.byId, action.id),
        allIds: pull(state.allIds, action.id),
      };

    case ADD_ANSWER_TO_EDITING_QUIZ:
    case CHANGE_ANSWER_TITLE_IN_EDITING_QUIZ:
    case CHANGE_ANSWER_CHECK_STATE_IN_EDITING_QUIZ:
    case REMOVE_ANSWER_FROM_EDITING_QUIZ:
      question = state.byId[action.questionId];

      return {
        ...state,

        byId: {
          ...state.byId,

          [action.questionId]: {
            ...question,
            answers: editingQuizAnswerReducer(question.answers, question.answerType, action),
          },
        },
      };

    case CHANGE_ANSWER_TYPE_IN_EDITING_QUIZ:
      question = state.byId[action.questionId];

      if (question.answerType === action.answerType) {
        return state;
      }

      return {
        ...state,

        byId: {
          ...state.byId,

          [action.questionId]: {
            ...question,
            answerType: action.answerType,
            answers: editingQuizAnswerReducer(question.answers, question.answerType, action),
          },
        },
      };

    default:
      return state;
  }
}

const EDITING_QUIZ_INITIAL_STATE = {
  title: '',
  descriptionEditorState: EditorState.createEmpty(),
  paragraphs: {
    byId: {},
    allIds: [],
  },
  questions: {
    byId: {},
    allIds: [],
  },
};

function editingQuizReducer(state = EDITING_QUIZ_INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE_TITLE_IN_EDITING_QUIZ:
      return {
        ...state,
        title: action.title,
      };

    case CHANGE_DESCRIPTION_EDITOR_STATE_IN_EDITING_QUIZ:
      return {
        ...state,
        descriptionEditorState: action.state,
      };

    case SAVE_EDITING_QUIZ:
      return {
        ...state,
      };

    case CLEAR_EDITING_QUIZ:
      return {
        ...EDITING_QUIZ_INITIAL_STATE,
      };

    case SET_EDITING_QUIZ:
      return {
        ...convertQuizForStore(action.quiz),
      };

    default:
      return {
        ...state,
        paragraphs: editingQuizParagraphReducer(state.paragraphs, action),
        questions: editingQuizQuestionReducer(state.questions, action),
      };
  }
}

export default combineReducers({
  editingQuiz: editingQuizReducer,
  snackbar: snackbarReducer,
});
