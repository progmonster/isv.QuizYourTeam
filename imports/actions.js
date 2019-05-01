import { put, select, takeEvery } from "redux-saga/effects";
import { Quizzes } from "./collections.js";
import { convertToRaw } from "draft-js";

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

export const SAVE_EDITING_QUIZ_SUCCESS = "SAVE_EDITING_QUIZ_SUCCESS";

export const SAVE_EDITING_QUIZ_FAIL = "SAVE_EDITING_QUIZ_FAIL";

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

export function saveEditingQuizSuccess() {
  return { type: SAVE_EDITING_QUIZ_SUCCESS };
}

export function saveEditingQuizFail(error) {
  return { type: SAVE_EDITING_QUIZ_FAIL, error };
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

function* saveEditingQuizAsync({history}) {
  const editingQuizJson = yield select(getEditingQuizJson);

  try {
    yield Quizzes.insertAsync(editingQuizJson);

    history.push("/admin/dashboard");


  } catch (error) {
    console.error(error);

    yield put(saveEditingQuizFail());
  }
}

function* watchSaveEditingQuiz() {
  yield takeEvery(SAVE_EDITING_QUIZ, saveEditingQuizAsync);
}

export function* rootSaga() {
  yield watchSaveEditingQuiz();
}
