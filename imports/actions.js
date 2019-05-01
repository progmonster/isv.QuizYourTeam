import { put, select, takeEvery, all } from "redux-saga/effects";
import { Quizzes } from "./collections.js";
import { convertToRaw } from "draft-js";
import { snackbarActions as snackbar } from "./components/snackbar";

export const CLEAR_EDITING_QUIZ = "CLEAR_EDITING_QUIZ";

export const CHANGE_TITLE_IN_EDITING_QUIZ = "CHANGE_TITLE_IN_EDITING_QUIZ";

export const CHANGE_DESCRIPTION_EDITOR_STATE_IN_EDITING_QUIZ = "CHANGE_DESCRIPTION_EDITOR_STATE_IN_EDITING_QUIZ";

export const ADD_PARAGRAPH_TO_EDITING_QUIZ = "ADD_PARAGRAPH_TO_EDITING_QUIZ";

export const CHANGE_PARAGRAPH_EDITOR_STATE_IN_EDITING_QUIZ = "CHANGE_PARAGRAPH_EDITOR_STATE_IN_EDITING_QUIZ";

export const REMOVE_PARAGRAPH_FROM_EDITING_QUIZ = "REMOVE_PARAGRAPH_FROM_EDITING_QUIZ";

export const ADD_QUESTION_TO_EDITING_QUIZ = "ADD_QUESTION_TO_EDITING_QUIZ";

export const CHANGE_QUESTION_EDITOR_STATE_IN_EDITING_QUIZ = "CHANGE_QUESTION_EDITOR_STATE_IN_EDITING_QUIZ";

export const REMOVE_QUESTION_FROM_EDITING_QUIZ = "REMOVE_QUESTION_FROM_EDITING_QUIZ";

export const ADD_ANSWER_TO_EDITING_QUIZ = "ADD_ANSWER_TO_EDITING_QUIZ";

export const CHANGE_ANSWER_TITLE_IN_EDITING_QUIZ = "CHANGE_ANSWER_TITLE_IN_EDITING_QUIZ";

export const REMOVE_ANSWER_FROM_EDITING_QUIZ = "REMOVE_ANSWER_FROM_EDITING_QUIZ";

export const CHANGE_ANSWER_CHECK_STATE_IN_EDITING_QUIZ = "CHANGE_ANSWER_CHECK_STATE_IN_EDITING_QUIZ";

export const CHANGE_ANSWER_TYPE_IN_EDITING_QUIZ = "CHANGE_ANSWER_TYPE_IN_EDITING_QUIZ";

export const SAVE_EDITING_QUIZ = "SAVE_EDITING_QUIZ";

export const REMOVE_QUIZ = "REMOVE_QUIZ";

export function clearEditingQuiz() {
  return { type: CLEAR_EDITING_QUIZ };
}

export function changeTitleInEditingQuiz(title) {
  return { type: CHANGE_TITLE_IN_EDITING_QUIZ, title };
}

export function changeDescriptionEditorStateInEditingQuiz(state) {
  return { type: CHANGE_DESCRIPTION_EDITOR_STATE_IN_EDITING_QUIZ, state };
}

export function addParagraphToEditingQuiz() {
  return { type: ADD_PARAGRAPH_TO_EDITING_QUIZ };
}

export function changeParagraphEditorStateInEditingQuiz(id, state) {
  return { type: CHANGE_PARAGRAPH_EDITOR_STATE_IN_EDITING_QUIZ, id, state };
}

export function removeParagraphFromEditingQuiz(id) {
  return { type: REMOVE_PARAGRAPH_FROM_EDITING_QUIZ, id };
}

export function addQuestionToEditingQuiz() {
  return { type: ADD_QUESTION_TO_EDITING_QUIZ };
}

export function changeQuestionEditorStateInEditingQuiz(id, state) {
  return { type: CHANGE_QUESTION_EDITOR_STATE_IN_EDITING_QUIZ, id, state };
}

export function removeQuestionFromEditingQuiz(id) {
  return { type: REMOVE_QUESTION_FROM_EDITING_QUIZ, id };
}

export function addAnswerToEditingQuiz(questionId, title, checked) {
  return { type: ADD_ANSWER_TO_EDITING_QUIZ, questionId, title, checked };
}

export function changeAnswerTitleInEditingQuiz(questionId, answerId, title) {
  return { type: CHANGE_ANSWER_TITLE_IN_EDITING_QUIZ, questionId, answerId, title };
}

export function removeAnswerFromEditingQuiz(questionId, answerId) {
  return { type: REMOVE_ANSWER_FROM_EDITING_QUIZ, questionId, answerId };
}

export function changeAnswerCheckStateInEditingQuiz(questionId, answerId, checked) {
  return { type: CHANGE_ANSWER_CHECK_STATE_IN_EDITING_QUIZ, questionId, answerId, checked };
}

export function changeAnswerTypeInEditingQuiz(questionId, answerType) {
  return { type: CHANGE_ANSWER_TYPE_IN_EDITING_QUIZ, questionId, answerType };
}

export function saveEditingQuiz(history) {
  return { type: SAVE_EDITING_QUIZ, history };
}

export function removeQuiz(quizId) {
  return { type: REMOVE_QUIZ, quizId };
}

function getEditingQuizParagraphJson(paragraph) {
  return {
    ...paragraph,
    editorState: convertToRaw(paragraph.editorState.getCurrentContent())
  }
}

function getEditingQuizQuestionJson(question) {
  return {
    ...question,
    editorState: convertToRaw(question.editorState.getCurrentContent()),

    answers: question.answers.allIds.map(
      answerId => question.answers.byId[answerId]
    )
  }
}

function getEditingQuizJson({ editingQuiz }) {
  return {
    ...editingQuiz,
    descriptionEditorState: convertToRaw(editingQuiz.descriptionEditorState.getCurrentContent()),

    paragraphs: editingQuiz.paragraphs.allIds.map(
      paragraphId => getEditingQuizParagraphJson(editingQuiz.paragraphs.byId[paragraphId])
    ),

    questions: editingQuiz.questions.allIds.map(
      questionId => getEditingQuizQuestionJson(editingQuiz.questions.byId[questionId])
    )
  }
}

function* saveEditingQuizAsync({ history }) {
  const editingQuizJson = yield select(getEditingQuizJson);

  try {
    yield Quizzes.insertAsync(editingQuizJson);

    yield put(clearEditingQuiz());

    yield put(snackbar.show({ message: "Your quiz has been successfully saved!" }));

    history.push("/admin/dashboard");
  } catch (error) {
    console.error(error);

    yield put(snackbar.show({ message: `Error saving the quiz: ${error.message}` }));
  }
}

function* removeQuizAsync({ quizId }) {
  try {
    yield Quizzes.removeAsync(quizId);

    yield put(snackbar.show({ message: "The quiz has been successfully removed" }));
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
