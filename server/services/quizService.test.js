import quizService, { MAX_POSSIBLE_RESULT } from './quizService';

describe('quizService tests', () => {
  describe('pass results', () => {
    it('correct single type answer', () => {
      const quiz = {
        questions: [
          {
            answers: [
              { checked: false },
              { checked: true },
              {},
            ],
          },
        ],
      };

      const answers = [
        [
          {},
          { checked: true },
          { checked: false },
        ],
      ];

      expect(quizService.calculatePassScore(quiz, answers))
        .toStrictEqual({
          maxPossibleResult: MAX_POSSIBLE_RESULT,
          answeredCorrectlyQuestionNumber: 1,
          result: 10,
        });
    });

    it('correct multiple type answer', () => {
      const quiz = {
        questions: [
          {
            answers: [
              { checked: false },
              { checked: true },
              {},
              { checked: true },
            ],
          },
        ],
      };

      const answers = [
        [
          { checked: false },
          { checked: true },
          {},
          { checked: true },
        ],
      ];

      expect(quizService.calculatePassScore(quiz, answers))
        .toStrictEqual({
          maxPossibleResult: MAX_POSSIBLE_RESULT,
          answeredCorrectlyQuestionNumber: 1,
          result: 10,
        });
    });
  });
});
