import { EditorState } from 'draft-js';
import {
  ADD_ANSWER_TO_EDITING_QUIZ,
  ADD_PARAGRAPH_TO_EDITING_QUIZ,
  ADD_QUESTION_TO_EDITING_QUIZ, CHANGE_ANSWER_CHECK_STATE_IN_EDITING_QUIZ, CHANGE_ANSWER_TITLE_IN_EDITING_QUIZ,
  CHANGE_PARAGRAPH_EDITOR_STATE_IN_EDITING_QUIZ,
  CHANGE_QUESTION_EDITOR_STATE_IN_EDITING_QUIZ, REMOVE_ANSWER_FROM_EDITING_QUIZ,
  REMOVE_PARAGRAPH_FROM_EDITING_QUIZ,
  REMOVE_QUESTION_FROM_EDITING_QUIZ
} from './actions';
import omit from 'lodash/omit';
import pull from 'lodash/pull';
import max from 'lodash/max';
import { ANSWER_TYPES } from "./views/Quizzes/AnswerTypes";

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
            ...state.byId[action.Id],
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

function editingQuizQuestionReducer(state = { byId: {}, allIds: [] }, action) {
  switch (action.type) {
    case ADD_QUESTION_TO_EDITING_QUIZ:
      const newQuestionId = (max(state.allIds) || 0) + 1;

      return {
        ...state,

        byId: {
          ...state.byId,

          [newQuestionId]: {
            editorState: EditorState.createEmpty(),
            answerType: ANSWER_TYPES.SINGLE_CHOICE,
            answers: { allIds: [], byId: {} },
          }
        },

        allIds: [...state.allIds, newQuestionId]
      };

    case CHANGE_QUESTION_EDITOR_STATE_IN_EDITING_QUIZ:
      return {
        ...state,

        byId: {
          ...state.byId,

          [action.id]: {
            ...state.byId[action.Id],
            editorState: action.state
          }
        }
      };

    case REMOVE_QUESTION_FROM_EDITING_QUIZ:
      return {
        ...state,
        byId: omit(state.byId, action.id),
        allIds: pull(state.allIds, action.id)
      };

    case ADD_ANSWER_TO_EDITING_QUIZ:
      const newAnswerId = (max(state.byId[action.questionId].answers.allIds) || 0) + 1;

      return {
        ...state,

        byId: {
          ...state.byId,

          [action.questionId]: {
            ...state.byId[action.questionId],

            answers: {
              ...state.byId[action.questionId].answers,

              byId: {
                ...state.byId[action.questionId].answers.byId,

                [newAnswerId]: {
                  title: action.title,
                  checked: action.checked,
                }
              },

              allIds: [...state.byId[action.questionId].answers.allIds, newAnswerId],
            }
          }
        }
      };

    case CHANGE_ANSWER_TITLE_IN_EDITING_QUIZ:
      return {
        ...state,

        byId: {
          ...state.byId,

          [action.questionId]: {
            ...state.byId[action.questionId],

            answers: {
              ...state.byId[action.questionId].answers,

              byId: {
                ...state.byId[action.questionId].answers.byId,

                [action.answerId]: {
                  ...state.byId[action.questionId].answers.byId[action.answerId],
                  title: action.title,
                }
              },
            }
          }
        }
      };

    case REMOVE_ANSWER_FROM_EDITING_QUIZ:
      return {
        ...state,

        byId: {
          ...state.byId,

          [action.questionId]: {
            ...state.byId[action.questionId],

            answers: {
              ...state.byId[action.questionId].answers,

              byId: omit(state.byId[action.questionId].answers.byId, action.answerId),
              allIds: pull(state.byId[action.questionId].answers.allIds, action.answerId),
            }
          }
        }
      };

    case CHANGE_ANSWER_CHECK_STATE_IN_EDITING_QUIZ:
/*
  onAnswerCheckStateChange = (questionNumber, answerNumber, checked) => {
    this.setState((state) => {
        const questionIdx = (questionNumber - 1);

        const answerIdx = (answerNumber - 1);

        const answerType = state.questions[questionIdx].answers.type;

        const updateAnswers = (answers) => {
          return answers.map((answer, idx) => {
            let newCheckedState;

            if (idx === answerIdx) {
              newCheckedState = checked;
            } else {
              if (answerType === ANSWER_TYPES.SINGLE_CHOICE) {
                newCheckedState = false;
              } else {
                newCheckedState = answer.checked;
              }
            }

            return ({ ...answer, checked: newCheckedState });
          });
        };

        return update(
          state,
          { questions: { [questionIdx]: { answers: { items: { $apply: updateAnswers } } } } }
        );
      }
    );
  };

*/

      return state;/*todo*/

    default:
      return state;
  }
}

function editingQuizReducer(state = {}, action) {
  return {
    ...state,
    paragraphs: editingQuizParagraphReducer(state.paragraphs, action),
    questions: editingQuizQuestionReducer(state.questions, action),
  }
}

const reducers = (state = {}, action) => {
  return {
    ...state,
    editingQuiz: editingQuizReducer(state.editingQuiz, action)
  }
};

export default reducers;
