import './style.css';
import words from './words.json';
import { VocabularyTrainer } from './VocabularyTrainer';
import { DomController } from './DomController';

const vocabularyTrainer = new VocabularyTrainer(new DomController(), words);
vocabularyTrainer.init();
