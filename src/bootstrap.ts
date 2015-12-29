/*
 * Providers provided by Angular
 */
import {bootstrap} from 'angular2/platform/browser';
//import {ROUTER_PROVIDERS} from 'angular2/router';
//import {HTTP_PROVIDERS} from 'angular2/http';
// include for development builds
//import {ELEMENT_PROBE_PROVIDERS} from 'angular2/platform/common_dom';
// include for production builds
// import {enableProdMode} from 'angular2/core';

import {App} from './app/app';

bootstrap(App)
