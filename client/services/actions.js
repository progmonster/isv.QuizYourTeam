import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import range from 'lodash/range';
import { snackbarActions as snackbar } from '../components/snackbar';
import quizService from './quizService';
import { history } from '../main';

export const CLEAR_EDITING_QUIZ = 'CLEAR_EDITING_QUIZ';

export const CHANGE_TITLE_IN_EDITING_QUIZ = 'CHANGE_TITLE_IN_EDITING_QUIZ';

export const CHANGE_DESCRIPTION_EDITOR_STATE_IN_EDITING_QUIZ = 'CHANGE_DESCRIPTION_EDITOR_STATE_IN_EDITING_QUIZ';

export const ADD_PARAGRAPH_TO_EDITING_QUIZ = 'ADD_PARAGRAPH_TO_EDITING_QUIZ';

export const CHANGE_PARAGRAPH_EDITOR_STATE_IN_EDITING_QUIZ = 'CHANGE_PARAGRAPH_EDITOR_STATE_IN_EDITING_QUIZ';

export const REMOVE_PARAGRAPH_FROM_EDITING_QUIZ = 'REMOVE_PARAGRAPH_FROM_EDITING_QUIZ';

export const ADD_QUESTION_TO_EDITING_QUIZ = 'ADD_QUESTION_TO_EDITING_QUIZ';

export const CHANGE_QUESTION_EDITOR_STATE_IN_EDITING_QUIZ = 'CHANGE_QUESTION_EDITOR_STATE_IN_EDITING_QUIZ';

export const REMOVE_QUESTION_FROM_EDITING_QUIZ = 'REMOVE_QUESTION_FROM_EDITING_QUIZ';

export const ADD_ANSWER_TO_EDITING_QUIZ = 'ADD_ANSWER_TO_EDITING_QUIZ';

export const CHANGE_ANSWER_TITLE_IN_EDITING_QUIZ = 'CHANGE_ANSWER_TITLE_IN_EDITING_QUIZ';

export const REMOVE_ANSWER_FROM_EDITING_QUIZ = 'REMOVE_ANSWER_FROM_EDITING_QUIZ';

export const CHANGE_ANSWER_CHECK_STATE_IN_EDITING_QUIZ = 'CHANGE_ANSWER_CHECK_STATE_IN_EDITING_QUIZ';

export const CHANGE_ANSWER_TYPE_IN_EDITING_QUIZ = 'CHANGE_ANSWER_TYPE_IN_EDITING_QUIZ';

export const SAVE_EDITING_QUIZ = 'SAVE_EDITING_QUIZ';

export const REMOVE_QUIZ = 'REMOVE_QUIZ';

export const SET_EDITING_QUIZ = 'SET_EDITING_QUIZ';

export function clearEditingQuiz() {
  return { type: CLEAR_EDITING_QUIZ };
}

export function changeTitleInEditingQuiz(title) {
  return {
    type: CHANGE_TITLE_IN_EDITING_QUIZ,
    title,
  };
}

export function changeDescriptionEditorStateInEditingQuiz(state) {
  return {
    type: CHANGE_DESCRIPTION_EDITOR_STATE_IN_EDITING_QUIZ,
    state,
  };
}

export function addParagraphToEditingQuiz() {
  return { type: ADD_PARAGRAPH_TO_EDITING_QUIZ };
}

export function changeParagraphEditorStateInEditingQuiz(id, state) {
  return {
    type: CHANGE_PARAGRAPH_EDITOR_STATE_IN_EDITING_QUIZ,
    id,
    state,
  };
}

export function removeParagraphFromEditingQuiz(id) {
  return {
    type: REMOVE_PARAGRAPH_FROM_EDITING_QUIZ,
    id,
  };
}

export function addQuestionToEditingQuiz() {
  return { type: ADD_QUESTION_TO_EDITING_QUIZ };
}

export function changeQuestionEditorStateInEditingQuiz(id, state) {
  return {
    type: CHANGE_QUESTION_EDITOR_STATE_IN_EDITING_QUIZ,
    id,
    state,
  };
}

export function removeQuestionFromEditingQuiz(id) {
  return {
    type: REMOVE_QUESTION_FROM_EDITING_QUIZ,
    id,
  };
}

export function addAnswerToEditingQuiz(questionId, title, checked) {
  return {
    type: ADD_ANSWER_TO_EDITING_QUIZ,
    questionId,
    title,
    checked,
  };
}

export function changeAnswerTitleInEditingQuiz(questionId, answerId, title) {
  return {
    type: CHANGE_ANSWER_TITLE_IN_EDITING_QUIZ,
    questionId,
    answerId,
    title,
  };
}

export function removeAnswerFromEditingQuiz(questionId, answerId) {
  return {
    type: REMOVE_ANSWER_FROM_EDITING_QUIZ,
    questionId,
    answerId,
  };
}

export function changeAnswerCheckStateInEditingQuiz(questionId, answerId, checked) {
  return {
    type: CHANGE_ANSWER_CHECK_STATE_IN_EDITING_QUIZ,
    questionId,
    answerId,
    checked,
  };
}

export function changeAnswerTypeInEditingQuiz(questionId, answerType) {
  return {
    type: CHANGE_ANSWER_TYPE_IN_EDITING_QUIZ,
    questionId,
    answerType,
  };
}

export function saveEditingQuiz(teamId) {
  return {
    type: SAVE_EDITING_QUIZ,
    teamId,
  };
}

export function removeQuiz(quizId) {
  return {
    type: REMOVE_QUIZ,
    quizId,
  };
}

export function setEditingQuiz(quiz) {
  return {
    type: SET_EDITING_QUIZ,
    quiz,
  };
}

function getEditingQuizParagraphFromStore(paragraph) {
  return {
    ...paragraph,
    editorState: convertToRaw(paragraph.editorState.getCurrentContent()),
  };
}

function getEditingQuizQuestionFromStore(question) {
  return {
    ...question,
    editorState: convertToRaw(question.editorState.getCurrentContent()),

    answers: question.answers.allIds.map(
      answerId => question.answers.byId[answerId],
    ),
  };
}

function getEditingQuizFromStore({ editingQuiz }) {
  return {
    ...editingQuiz,
    descriptionEditorState: convertToRaw(editingQuiz.descriptionEditorState.getCurrentContent()),

    paragraphs: editingQuiz.paragraphs.allIds.map(
      paragraphId => getEditingQuizParagraphFromStore(editingQuiz.paragraphs.byId[paragraphId]),
    ),

    questions: editingQuiz.questions.allIds.map(
      questionId => getEditingQuizQuestionFromStore(editingQuiz.questions.byId[questionId]),
    ),
  };
}

export function convertQuizForStore(quiz) {
  return {
    ...quiz,

    descriptionEditorState: EditorState.createWithContent(
      convertFromRaw(quiz.descriptionEditorState),
    ),

    paragraphs: convertQuizParagraphsForStore(quiz.paragraphs),
    questions: convertQuizQuestionsForStore(quiz.questions),
  };
}

function convertQuizParagraphsForStore(paragraphs = []) {
  const byId = paragraphs.reduce((acc, paragraph, paragraphIdx) => {
    acc[paragraphIdx + 1] = {
      ...paragraph,
      editorState: EditorState.createWithContent(convertFromRaw(paragraph.editorState)),
    };

    return acc;
  }, {});

  return {
    byId,
    allIds: range(1, paragraphs.length + 1),
  };
}

function convertQuizQuestionsForStore(questions = []) {
  const byId = questions.reduce((acc, question, questionIdx) => {
    acc[questionIdx + 1] = {
      ...question,
      editorState: EditorState.createWithContent(convertFromRaw(question.editorState)),
      answers: convertQuizAnswersForStore(question.answers),
    };

    return acc;
  }, {});

  return {
    byId,
    allIds: range(1, questions.length + 1),
  };
}

function convertQuizAnswersForStore(answers = []) {
  const byId = answers.reduce((acc, answer, answerIdx) => {
    acc[answerIdx + 1] = {
      ...answer,
    };

    return acc;
  }, {});

  return {
    byId,
    allIds: range(1, answers.length + 1),
  };
}

function* saveEditingQuizAsync({ teamId }) {
  const editingQuiz = yield select(getEditingQuizFromStore);

  try {
    if (editingQuiz._id) {
      yield quizService.update(editingQuiz);
    } else {
      yield quizService.insert({
        ...editingQuiz,
        teamId,
      });
    }

    yield put(clearEditingQuiz());

    yield put(snackbar.show({ message: 'Your quiz has been successfully saved!' }));

    yield call(history.push, '/dashboard');
  } catch (error) {
    console.error(error);

    yield put(snackbar.show({ message: `Error saving the quiz: ${error.message}` }));
  }
}

function* removeQuizAsync({ quizId }) {
  try {
    yield quizService.remove(quizId);

    yield put(snackbar.show({ message: 'The quiz has been successfully removed' }));
  } catch (error) {
    console.error(error);

    yield put(snackbar.show({ message: `Error removing the quiz: ${error.message}` }));
  }
}

function* watchSaveEditingQuiz() {
  yield takeEvery(SAVE_EDITING_QUIZ, saveEditingQuizAsync);
}

function* watchRemoveQuiz() {
  yield takeEvery(REMOVE_QUIZ, removeQuizAsync);
}

export function* rootSaga() {
  yield all([
    watchSaveEditingQuiz(),
    watchRemoveQuiz(),
  ]);
}
