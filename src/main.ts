import './style.css';
import words from './words.json';

class DomController {
  private answerInput: HTMLElement | null;
  private wordInput: HTMLElement | null;

  init() {
    this.answerInput = document.getElementById('answer');
    this.wordInput = document.getElementById('letters');
  }

  createButton(letter: string, variant = 'blue') {
    const button = document.createElement('button');
    button.classList.add('button', `button--${variant}`);
    button.textContent = letter;

    button.addEventListener(
      'click',
      () => {
        this.moveButtonToAnswerInput(button);
        button.classList.remove('button--blue');
        button.classList.add('button--green');
      },
      { once: true }
    );

    return button;
  }

  insertWord(word: string) {
    word.split('').forEach((letter) => {
      const button = this.createButton(letter);
      this.wordInput?.appendChild(button);
    });
  }

  moveButtonToAnswerInput(button: HTMLElement) {
    this.answerInput?.appendChild(button);
  }

  removeLetterFromWord(id) {}
}

class VocabularyTrainer {
  constructor(
    private domController: DomController,
    private words: string[]
  ) {}

  private vocabulary: string[] = [];
  private answeredLetters: string[] = [];
  private letters: string[] = [];
  private stage = 0;
  private mistakeCount = 0;

  init() {
    this.domController.init();
    this.setVocabulary();
    this.initStage();
  }

  get stageAnswer() {
    return this.vocabulary[this.stage];
  }

  shuffleArray<T>(array: T[]) {
    return array.sort(() => 0.5 - Math.random());
  }

  setVocabulary(amount = 6) {
    this.vocabulary = this.shuffleArray<string>(this.words).slice(0, amount);
  }

  initStage() {
    this.letters = this.shuffleArray(this.stageAnswer.split(''));
    this.domController.insertWord(this.letters.join(''));
  }

  removeLetterFromLetters(letterIndex: number) {
    this.answeredLetters.push(this.letters[letterIndex]);
  }

  addLetterToAnswer(letterIndex: number) {
    this.letters.splice(letterIndex, 1);
  }

  onLetterInput(letterIndex: number) {
    if (this.letters[letterIndex] !== this.stageAnswer[letterIndex]) {
      this.mistakeCount++;
      return;
    }

    this.addLetterToAnswer(letterIndex)
    this.removeLetterFromLetters(letterIndex);
  }
}

const vocabularyTrainer = new VocabularyTrainer(new DomController(), words);
vocabularyTrainer.init();

// TODO: separate letter insert and removal logic
// TODO: create button control interface so I can add and remove event listener and flash animation
