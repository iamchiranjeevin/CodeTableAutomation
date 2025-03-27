import { TemplatePageTitleStrategy } from './template-page-title-strategy';
import { Title } from '@angular/platform-browser';

describe('TemplatePageTitleStrategy', () => {
  it('should create an instance', () => {
    expect(new TemplatePageTitleStrategy(new Title(''))).toBeTruthy();
  });
});
