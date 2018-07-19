import { InjectionToken } from '@angular/core';
import { LsNavigationConfigInterface } from '../models/ls-navigation-config.interface';
/**
 * This is not a real service, but it looks like it from the outside.
 * It's just an InjectionTToken used to import the config object, provided from the outside
 */
export const LsNavigationConfigService = new InjectionToken<LsNavigationConfigInterface>("LsNavigationConfigInterface");
