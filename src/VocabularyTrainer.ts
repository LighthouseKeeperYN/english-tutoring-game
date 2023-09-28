import { DomController } from './DomController';

export class VocabularyTrainer {
  private readonly MAX_STAGE = 5;
  private readonly MAX_MISTAKES = 3;

  constructor(
    private domController: DomController,
    private words: string[]
  ) {}

  private vocabulary: string[] = [];
  private answeredLetters: string[] = [];
  private letters: string[] = [];
  private stage = 0;
  private mistakeCount = 0;
  private stats = {
    wordsWithoutMistakes: 0,
    totalMistakes: 0,
    wordWithMostMistakes: {
      word: '',
      mistakesCount: 0,
    },
  };

  init() {
    this.domController.init(this.onKeyUp.bind(this));
    this.setVocabulary();
    this.initStage();
  }

  get stageAnswer() {
    return this.vocabulary[this.stage];
  }

  get isStageFailed() {
    return this.mistakeCount >= this.MAX_MISTAKES;
  }

  get isGameFinished() {
    return this.stage > this.MAX_STAGE;
  }

  shuffleArray<T>(array: T[]) {
    return array.sort(() => 0.5 - Math.random());
  }

  setVocabulary() {
    this.vocabulary = this.shuffleArray<string>(this.words).slice(0, this.MAX_STAGE + 1);
  }

  initStage() {
    if (this.isGameFinished) {
      this.domController.renderStatistics(this.stats);
      return;
    }

    this.answeredLetters = [];
    this.mistakeCount = 0;
    this.letters = this.shuffleArray(this.stageAnswer.split(''));
    this.domController.renderStageNumber(this.stage);
    this.domController.renderMaxStageNumber(this.MAX_STAGE);
    this.domController.renderAnswerLetters([]);
    this.domController.renderWordLetters(this.letters, this.onButtonClick.bind(this));
  }

  updateStage() {
    if (this.stageAnswer.length === this.answeredLetters.length) {
      if (this.mistakeCount === 0) {
        this.stats.wordsWithoutMistakes++;
      }

      this.stage++;
      this.initStage();
    }

    if (this.isStageFailed) {
      this.domController.renderAnswerLetters([]);
      this.domController.renderWordLetters(this.stageAnswer.split(''));
      this.domController.animateAllWordButtons();

      setTimeout(() => {
        this.stage++;
        this.initStage();
      }, 1000);
    }
  }

  removeLetterFromLetters(letterIndex: number) {
    this.letters.splice(letterIndex, 1);
    this.domController.renderWordLetters(this.letters, this.onButtonClick.bind(this));
  }

  addLetterToAnswer(letterIndex: number) {
    this.answeredLetters.push(this.letters[letterIndex]);
    this.domController.renderAnswerLetters(this.answeredLetters);
  }

  countMistake() {
    this.mistakeCount++;
    this.stats.totalMistakes++;

    if (this.mistakeCount > this.stats.wordWithMostMistakes.mistakesCount) {
      this.stats.wordWithMostMistakes.word = this.stageAnswer;
      this.stats.wordWithMostMistakes.mistakesCount = this.mistakeCount;
    }

    this.updateStage();
  }

  acceptLetter(letterIndex: number) {
    this.addLetterToAnswer(letterIndex);
    this.removeLetterFromLetters(letterIndex);
    this.updateStage();
  }

  onButtonClick(letterIndex: number) {
    const isCorrectLetter =
      this.letters[letterIndex] === this.stageAnswer[this.answeredLetters.length];

    if (isCorrectLetter) {
      this.acceptLetter(letterIndex);
      return true;
    } else {
      this.countMistake();
      return false;
    }
  }

  onKeyUp(event: Event, buttons: Element[]) {
    const { key } = event as KeyboardEvent;
    const letterIndex = this.letters.indexOf(key);

    if (letterIndex < 0) {
      this.countMistake();
      this.updateStage();
      return;
    }

    const isCorrectLetter = key === this.stageAnswer[this.answeredLetters.length];

    if (isCorrectLetter) {
      this.acceptLetter(letterIndex)
    } else {
      this.domController.triggerAnimation(buttons[letterIndex])
      this.countMistake();
    }
  }
}
