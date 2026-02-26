import { Directive, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainHelpers } from 'nextalys-js-helpers';
import { EventsCollector } from 'nextalys-js-helpers/dist/events';
import { Observable, Subject } from 'rxjs';
import { RoutesList } from '../../../../shared/routes';
import { AppDirectories, RolesList } from '../../../../shared/shared-constants';
import { environment } from '../../environments/environment';
import { AuthDataService } from '../../services/auth-data.service';
import { ErrorManager } from '../../services/error-manager';
import { GlobalAppService } from '../../services/global.service';
import { BaseSimpleError } from '../../services/simple-types';

//see https://github.com/angular/angular/issues/37769
@Directive({})
export abstract class BaseComponent implements OnDestroy {
    destroySubject = new Subject<void>();
    public AppDirectories = AppDirectories;
    public environment = environment;
    public RoutesList = RoutesList;
    public GlobalAppService = GlobalAppService;
    public RolesList = RolesList;
    public AuthDataService = AuthDataService;
    eventsCollector: EventsCollector = new EventsCollector();
    public hasPendingModifications = false;
    today = new Date();
    private intervalIds: number[] = [];
    private timeoutIds: number[] = [];

    constructor(public unloadMessage?: string) {
        if (unloadMessage) {
            this.eventsCollector.addAndCollectListener(
                window,
                'beforeunload',
                (evt: any) => {
                    this.beforeUnload(evt);
                },
                { passive: true },
            );
        }
    }

    private beforeUnload(evt: { returnValue: string }) {
        if (this.hasPendingModifications && this.unloadMessage) {
            evt.returnValue = this.unloadMessage;

            return evt.returnValue;
        }
    }

    ngOnDestroy() {
        this.eventsCollector.unsubscribeAll();

        if (this.intervalIds?.length) {
            for (const intervalId of this.intervalIds) {
                try {
                    // console.log('clearing interval ...', intervalId);
                    clearInterval(intervalId);
                } catch (error) {
                    console.log('on destroy - clear interval ERROR ', error);
                }
            }

            this.intervalIds = [];
        }

        if (this.timeoutIds?.length) {
            for (const timeoutId of this.timeoutIds) {
                try {
                    // console.log('clearing timeout ...', timeoutId);
                    clearTimeout(timeoutId);
                } catch (error) {
                    console.log('on destroy - clear timeout ERROR ', error);
                }
            }

            this.timeoutIds = [];
        }
    }

    setInterval(
        cb: () => any,
        interval: number,
        alreadyExistingIntervalId?: number,
    ): any {
        this.clearInterval(alreadyExistingIntervalId);
        const id = setInterval(cb.bind(this), interval);
        this.intervalIds.push(id as any);

        return id;
    }

    setTimeout(
        cb: () => any,
        interval: number,
        alreadyExistingTimeoutId?: number,
    ): any {
        this.clearTimeout(alreadyExistingTimeoutId);
        const id = setTimeout(cb.bind(this), interval);
        this.timeoutIds.push(id as any);

        return id;
    }

    subscribeToObservable<T = any>(
        observable: Observable<T>,
        callback: (data: T) => void,
    ) {
        this.eventsCollector.subscribe<T>(observable, callback);
    }

    subscribeToEvent<T = any>(subject: Subject<T>, callback: (arg: T) => void) {
        this.eventsCollector.collect(subject.subscribe(callback));
    }

    replaceLineBreakWithBr(textToDisplay: string) {
        if (!textToDisplay) return;

        return MainHelpers.replaceAll(textToDisplay, '\n', '<br />');
    }

    setQueryParameters(router: Router, route: ActivatedRoute, data: any) {
        router.navigate([], {
            relativeTo: route,
            queryParams: data,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        });
    }

    sendApiRequest<T>(method: Observable<T>): Promise<T> {
        return GlobalAppService.sendApiRequest(
            method,
            this.destroySubject,
            this.eventsCollector,
        );
    }

    print(closeMenu = true) {
        this.GlobalAppService.print(this, closeMenu);
    }

    handleErrorResponse(
        response: BaseSimpleError,
        showReportButton = true,
    ): boolean {
        return ErrorManager.handleErrorResponse(
            response,
            this,
            showReportButton,
        );
    }

    private clearInterval(intervalId: number) {
        if (intervalId == null) {
            return;
        }

        try {
            // console.log('clearing interval ...', intervalId);
            clearInterval(intervalId);
        } catch (error) {
            console.log('on destroy - clear interval ERROR ', error);
        }

        const index = this.intervalIds?.findIndex((x) => x === intervalId);

        if (index != null && index !== -1) {
            this.intervalIds.splice(index, 1);
        }
    }

    private clearTimeout(timeoutId: number) {
        if (timeoutId == null) {
            return;
        }

        try {
            // console.log('clearing interval ...', intervalId);
            clearTimeout(timeoutId);
        } catch (error) {
            console.log('on destroy - clear timeout ERROR ', error);
        }

        const index = this.timeoutIds?.findIndex((x) => x === timeoutId);

        if (index != null && index !== -1) {
            this.timeoutIds.splice(index, 1);
        }
    }
}
