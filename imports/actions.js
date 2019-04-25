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

export function changeAnswerCheckStateInEditingQuiz(questionId, answerId, checked ) {
  return { type: CHANGE_ANSWER_CHECK_STATE_IN_EDITING_QUIZ, questionId, answerId, checked };
}

export function changeAnswerTypeInEditingQuiz(questionId, answerType ) {
  return { type: CHANGE_ANSWER_TYPE_IN_EDITING_QUIZ, questionId, answerType };
}
