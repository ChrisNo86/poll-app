import { Component, ElementRef, afterNextRender, inject, output, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MIN_ANSWERS_PER_QUESTION, SURVEY_CATEGORIES } from '../../models/survey.constants';
import { NewSurvey, Question } from '../../models/survey.model';
import { SurveyService } from '../../services/survey.service';
import { notBlank, notInPast, parseDateInput, showsError } from '../../utils/form-validators.util';
import { toLetter } from '../../utils/vote-key.util';

type QuestionGroup = FormGroup<{
  text: FormControl<string>;
  allowMultiple: FormControl<boolean>;
  answers: FormArray<FormControl<string>>;
}>;

/** Overlay dialog (no own route) to create a new survey. */
@Component({
  selector: 'app-create-survey-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './create-survey-dialog.html',
  styleUrl: './create-survey-dialog.scss',
  host: { '(document:keydown.escape)': 'close()' },
})
export class CreateSurveyDialog {
  readonly closed = output<void>();

  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly surveyService = inject(SurveyService);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly categories = SURVEY_CATEGORIES;
  protected readonly isSaving = signal<boolean>(false);
  protected readonly saveError = signal<string>('');
  protected readonly today = new Date().toISOString().slice(0, 10);
  protected readonly showsError = showsError;
  protected readonly toLetter = toLetter;

  protected readonly form = this.formBuilder.group({
    title: ['', [notBlank]],
    category: ['', [Validators.required]],
    endDate: ['', [notInPast]],
    description: [''],
    questions: this.formBuilder.array<QuestionGroup>([this.createQuestion()]),
  });

  constructor() {
    afterNextRender(() => this.elementRef.nativeElement.querySelector<HTMLElement>('#survey-title')?.focus());
  }

  protected get questions(): FormArray<QuestionGroup> {
    return this.form.controls.questions;
  }

  protected close(): void {
    this.closed.emit();
  }

  protected answersOf(question: QuestionGroup): FormArray<FormControl<string>> {
    return question.controls.answers;
  }

  protected addQuestion(): void {
    this.questions.push(this.createQuestion());
  }

  protected removeQuestion(index: number): void {
    if (this.questions.length > 1) {
      this.questions.removeAt(index);
    }
  }

  protected addAnswer(question: QuestionGroup): void {
    this.answersOf(question).push(this.formBuilder.control('', [notBlank]));
  }

  protected removeAnswer(question: QuestionGroup, index: number): void {
    if (this.answersOf(question).length > MIN_ANSWERS_PER_QUESTION) {
      this.answersOf(question).removeAt(index);
    }
  }

  /** Validates the form and stores the survey. */
  protected async publish(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isSaving()) {
      return;
    }
    this.isSaving.set(true);
    try {
      await this.surveyService.createSurvey(this.buildSurvey());
      this.close();
    } catch {
      this.saveError.set('The survey could not be saved. Please try again.');
      this.isSaving.set(false);
    }
  }

  private createQuestion(): QuestionGroup {
    return this.formBuilder.group({
      text: ['', [notBlank]],
      allowMultiple: [false],
      answers: this.formBuilder.array(
        Array.from({ length: MIN_ANSWERS_PER_QUESTION }, () => this.formBuilder.control('', [notBlank])),
      ),
    });
  }

  private buildSurvey(): NewSurvey {
    const { title, category, endDate, description, questions } = this.form.getRawValue();
    return {
      title: title.trim(),
      category,
      description: description.trim(),
      endDate: endDate ? parseDateInput(endDate) : null,
      questions: questions.map((question, index) => this.buildQuestion(question, index)),
    };
  }

  private buildQuestion(
    question: { text: string; allowMultiple: boolean; answers: string[] },
    index: number,
  ): Question {
    return {
      id: `q${index + 1}`,
      text: question.text.trim(),
      allowMultiple: question.allowMultiple,
      answers: question.answers.map((text, answerIndex) => ({ id: `a${answerIndex + 1}`, text: text.trim() })),
    };
  }
}
