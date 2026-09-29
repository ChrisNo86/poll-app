import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { SiteHeader } from '../../components/site-header/site-header';
import { SurveyCard } from '../../components/survey-card/survey-card';
import {
  ALL_CATEGORIES,
  ENDING_SOON_DAYS,
  ENDING_SOON_MAX_ITEMS,
  SURVEY_CATEGORIES,
} from '../../models/survey.constants';
import { Survey } from '../../models/survey.model';
import { SurveyDialogStore } from '../../services/survey-dialog.store';
import { SurveyService } from '../../services/survey.service';
import { endsWithinDays, isPastSurvey, sortByEndDate } from '../../utils/survey-date.util';

type SurveyTab = 'active' | 'past';

/** Home screen: hero, ending-soon surveys and the filterable survey list. */
@Component({
  selector: 'app-home',
  imports: [SiteHeader, SurveyCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly surveyService = inject(SurveyService);
  protected readonly dialogStore = inject(SurveyDialogStore);

  protected readonly categories: readonly string[] = [ALL_CATEGORIES, ...SURVEY_CATEGORIES];
  protected readonly tab = signal<SurveyTab>('active');
  private readonly categoryByTab = signal<Record<SurveyTab, string>>({
    active: ALL_CATEGORIES,
    past: ALL_CATEGORIES,
  });
  private readonly surveys = toSignal(this.surveyService.watchSurveys(), { initialValue: [] as Survey[] });

  protected readonly activeSurveys = computed<Survey[]>(() =>
    sortByEndDate(this.surveys().filter((survey) => !isPastSurvey(survey))),
  );
  protected readonly pastSurveys = computed<Survey[]>(() =>
    sortByEndDate(this.surveys().filter((survey) => isPastSurvey(survey))).reverse(),
  );
  protected readonly endingSoon = computed<Survey[]>(() =>
    this.activeSurveys()
      .filter((survey) => endsWithinDays(survey, ENDING_SOON_DAYS))
      .slice(0, ENDING_SOON_MAX_ITEMS),
  );
  protected readonly selectedCategory = computed<string>(() => this.categoryByTab()[this.tab()]);
  protected readonly visibleSurveys = computed<Survey[]>(() => {
    const source = this.tab() === 'active' ? this.activeSurveys() : this.pastSurveys();
    const category = this.selectedCategory();
    return category === ALL_CATEGORIES ? source : source.filter((survey) => survey.category === category);
  });

  /** Creates demo data on first start so the app can be tested right away. */
  ngOnInit(): void {
    void this.surveyService.seedIfEmpty();
  }

  protected selectTab(tab: SurveyTab): void {
    this.tab.set(tab);
  }

  protected selectCategory(category: string): void {
    this.categoryByTab.update((current) => ({ ...current, [this.tab()]: category }));
  }
}
