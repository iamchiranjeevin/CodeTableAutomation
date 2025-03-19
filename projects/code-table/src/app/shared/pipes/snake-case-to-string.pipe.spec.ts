import { SnakeCaseToStringPipe } from './snake-case-to-string.pipe';

describe('SnakeCaseToStringPipe', () => {
  it('create an instance', () => {
    const pipe = new SnakeCaseToStringPipe();
    expect(pipe).toBeTruthy();
  });
});
