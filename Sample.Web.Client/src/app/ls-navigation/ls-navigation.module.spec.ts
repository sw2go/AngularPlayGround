import { LsNavigationModule } from './ls-navigation.module';

describe('NavigationModule', () => {
  let navigationModule: LsNavigationModule;

  beforeEach(() => {
    navigationModule = new LsNavigationModule();
  });

  it('should create an instance', () => {
    expect(navigationModule).toBeTruthy();
  });
});
