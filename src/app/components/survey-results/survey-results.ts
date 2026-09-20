import { Component, input } from '@angular/core';

import { Question, Survey } from '../../models/survey.model';
import { getAnswerPercent, toLetter } from '../../utils/vote-key.util';

/** Live evaluation of a survey as percentage bars per question. */
@Component({
  selector: 'app-survey-results',
  templateUrl: './survey-results.html',
  styleUrl: './survey-results.scss',
})
export class SurveyResults {
  readonly survey = input.required<Survey>();
  protected readonly toLetter = toLetter;

  protected percentOf(question: Question, answerId: string): number {
    return getAnswerPercent(this.survey(), question, answerId);
  }
}
