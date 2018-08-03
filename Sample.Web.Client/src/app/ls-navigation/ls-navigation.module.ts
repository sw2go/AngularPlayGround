import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LsNavigationService } from './services/ls-navigation-service.service';
import { LsNavigationSectionDirective } from './directives/ls-navigation-section.directive';
import { LsNavigationRouterLinkDirective } from './directives/ls-navigation-routerlink.directive';
import { LsNavigationConfigInterface } from './models/ls-navigation-config.interface';
import { LsNavigationConfigService } from './services/ls-navigation-config.service'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LsNavigationSectionDirective,
    LsNavigationRouterLinkDirective
  ],
  exports: [ /* ... to make the selectors of declarable types (components, directives and pipes) visible in other modules  */
    LsNavigationSectionDirective,
    LsNavigationRouterLinkDirective
  ],
  providers: [
    /* Intentionally no providers here! See providers in forRoot() */
  ] 
})



/**
 * This is export class LsNavigationModule 
 *
 */
export class LsNavigationModule { 
  /**
   * Enables in-page scrolling to ls-navigation-section's  
   * and automatic "active" styling of ls-navigation-routerlink when manually scrolling.   
   * 
   * Tip to solve compatibility-Problems:
   * - "scroll"-Position Firefox Problems: Set "ls-navigation-section" on <div> only, not on component.
   * - "smooth"-Scroll Problem on IE aund Edge: Use smoothscroll-polyfill
 */

    /* to import the module including providers for use in root module only */
    static forRoot(config: LsNavigationConfigInterface) : ModuleWithProviders {
      return {
        ngModule: LsNavigationModule,
        providers: [ 
          LsNavigationService,
          {
            provide: LsNavigationConfigService,
            useValue: config
          } 
        ]   
      }
    }

}
