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

/*
  onQuestionCreate = () => this.setState(
    (state) => update(state, { questions: { $push: [this.newBlankQuestion()] } })
  );

  onQuestionEditorStateChange = (questionNumber, editorState) =>
    this.setState((state) => {
        const questionIdx = (questionNumber - 1);

        return update(state, { questions: { [questionIdx]: { editorState: { $set: editorState } } } });
      }
    );

  onQuestionRemove = (questionNumber) =>
    this.setState((state) => {
        const questionIdx = (questionNumber - 1);

        return update(state, { questions: { $splice: [[questionIdx, 1]] } });
      }
    );

  newBlankQuestion = () => ({
    editorState: EditorState.createEmpty(),
    answers: { type: ANSWER_TYPES.SINGLE_CHOICE, items: [] },
  });

  onAnswerAdd = (questionNumber, title, checked) =>
    this.setState((state) => {
        const questionIdx = (questionNumber - 1);

        return update(
          state,
          { questions: { [questionIdx]: { answers: { items: { $push: [{ title, checked }] } } } } }
        );
      }
    );

  onAnswerRemove = (questionNumber, answerNumber) =>
    this.setState((state) => {
        const questionIdx = (questionNumber - 1);

        const answerIdx = (answerNumber - 1);

        return update(
          state,
          { questions: { [questionIdx]: { answers: { items: { $splice: [[answerIdx, 1]] } } } } }
        );
      }
    );

  onAnswerTitleChange = (questionNumber, answerNumber, title) =>
    this.setState((state) => {
        const questionIdx = (questionNumber - 1);

        const answerIdx = (answerNumber - 1);

        return update(
          state,
          { questions: { [questionIdx]: { answers: { items: { [answerIdx]: { title: { $set: title } } } } } } }
        );
      }
    );

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
