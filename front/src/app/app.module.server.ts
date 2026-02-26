import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FileHelpers } from 'nextalys-node-helpers';
import { Observable, Observer } from 'rxjs';
import { UniversalInterceptorService } from '../modules/shared/interceptors/universal-interceptor.service';
import { ServiceWorkerModuleMock } from '../providers/service-worker.mock.module';
import { WindowService } from '../services/window.service';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

export function universalLoader(): TranslateLoader {
  return {
    getTranslation: (lang: string) => {
      return new Observable<any>((observer: Observer<any>) => {
        FileHelpers.readFile(`./browser/assets/i18n/${lang}.json`, true).then((fileContent: string) => {
          if (fileContent)
            observer.next(JSON.parse(fileContent));
        }).finally(() => {
          observer.complete();
        });
      });
    },
  } as TranslateLoader;
}

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    NoopAnimationsModule,
    ServerTransferStateModule,
    ServiceWorkerModuleMock,
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useFactory: universalLoader },
    }),
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UniversalInterceptorService,
      multi: true, // <-- important (you can have many interceptors)
    },
    {
      provide: WindowService,
      useClass: WindowService,
    },
  ],
})
export class AppServerModule { }