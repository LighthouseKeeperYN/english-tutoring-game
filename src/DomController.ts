import type { VocabularyTrainer } from './VocabularyTrainer';

export class DomController {
  private container: HTMLElement | null;
  private answerInput: HTMLElement | null;
  private wordInput: HTMLElement | null;
  private stageNumber: HTMLElement | null;
  private maxStageNumber: HTMLElement | null;
  private wordButtons: Element[] | null;

  init(onKeyUp: VocabularyTrainer['onKeyUp']) {
    this.container = document.querySelector('.container');
    this.answerInput = document.getElementById('answer');
    this.wordInput = document.getElementById('letters');
    this.stageNumber = document.getElementById('current_question');
    this.maxStageNumber = document.getElementById('total_questions');

    document.addEventListener('keyup', (event) => onKeyUp(event, this.wordButtons || []));
  }

  createButton(letter: string, variant = 'blue') {
    const button = document.createElement('button');
    button.classList.add('button', `button--${variant}`);
    button.textContent = letter;

    return button;
  }

  renderStatistics(stats: VocabularyTrainer['stats']) {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="d-flex flex-column align-items-center w-100 text-center mx-auto">
        <h2>Statistics:</h2>
        <br>
        <p>Words without mistakes: ${stats.wordsWithoutMistakes}</p>
        <p>Word with most mistakes: ${stats.wordWithMostMistakes.word}</p>
        <p>Total mistakes: ${stats.totalMistakes}</p>
      <div>
    `;
  }

  renderMaxStageNumber(number: number) {
    if (this.maxStageNumber) {
      this.maxStageNumber.textContent = `${number + 1}`;
    }
  }

  renderStageNumber(number: number) {
    if (this.stageNumber) {
      this.stageNumber.textContent = `${number + 1}`;
    }
  }

  renderLetters(letters: string[], variant = 'blue') {
    const container = document.createElement('div');

    letters.forEach((letter) => {
      const button = this.createButton(letter, variant);
      container.appendChild(button);
    });

    return container;
  }

  renderAnswerLetters(letters: string[]) {
    const container = this.renderLetters(letters, 'green');

    this.answerInput?.children[0]?.remove();
    this.answerInput?.appendChild(container);
  }

  renderWordLetters(letters: string[], onButtonClick?: VocabularyTrainer['onButtonClick']) {
    this.wordInput?.children[0]?.remove();
    const container = this.renderLetters(letters);
    this.wordInput?.appendChild(container);

    if (!onButtonClick) return;

    this.wordButtons = Array.from(container.children);

    this.wordButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        const isCorrect = onButtonClick(index);

        if (!isCorrect) {
          this.triggerAnimation(button);
        }
      });
    });
  }

  triggerAnimation(button: Element) {
    button.classList.add('flash');
    setTimeout(() => button.classList.remove('flash'), 1000);
  }

  animateAllWordButtons() {
    const buttons = this.wordInput?.children[0].children || [];

    Array.from(buttons).forEach((button) => this.triggerAnimation(button));
  }

  moveButtonToAnswerInput(button: Element) {
    this.answerInput?.appendChild(button);
  }
}
