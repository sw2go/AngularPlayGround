import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LsNavigationService } from './services/ls-navigation-service.service';
import { LsNavigationFragmentDirective } from './directives/ls-navigation-fragment.directive';
import { LsNavigationRouterLinkDirective } from './directives/ls-navigation-routerlink.directive';
import { LsNavigationConfigInterface } from './models/ls-navigation-config.interface';
import { LsNavigationConfigService } from './services/ls-navigation-config.service'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LsNavigationFragmentDirective,
    LsNavigationRouterLinkDirective
  ],
  exports: [ /* ... to make the selectors of declarable types (components, directives and pipes) visible in other modules  */
    LsNavigationFragmentDirective,
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
 *  soo lla
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
