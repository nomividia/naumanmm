import {
    Compiler,
    Inject,
    Injectable,
    Injector,
    NgModuleFactory,
    Type,
    ViewContainerRef,
} from '@angular/core';
import { LAZY_WIDGETS } from '../environments/constants';

export enum LazyModuleEnum {
    ImageLibraryModule = 'image-library-module',
}
// This will create a dedicated JS bundle for lazy module
export const lazyWidgetsDefintions: {
    path: LazyModuleEnum;
    loadChildren: () => Promise<NgModuleFactory<any> | Type<any>>;
}[] = [
    // {
    //     path: LazyModuleEnum.ImageLibraryModule,
    //     loadChildren: () => import('../components/image-library/image-library.module').then(m => m.ImageLibraryModule),
    // },
];

// This function will work as a factory for injecting lazy widget array in the main module
export function lazyArrayToObj() {
    const result = {};

    for (const w of lazyWidgetsDefintions) {
        (result as any)[w.path] = w.loadChildren;
    }

    return result;
}

@Injectable()
export class LazyLoaderService {
    private loadedModules: {
        moduleName: LazyModuleEnum;
        componentFactory: any;
    }[] = [];
    constructor(
        private injector: Injector,
        private compiler: Compiler,
        @Inject(LAZY_WIDGETS)
        private lazyWidgets: {
            [key: string]: () => Promise<NgModuleFactory<any> | Type<any>>;
        },
    ) {}

    async load(name: LazyModuleEnum, container: ViewContainerRef) {
        let loadedModule = this.loadedModules.find(
            (x) => x.moduleName === name,
        );

        if (!loadedModule) {
            const tempModule = await this.lazyWidgets[name]();
            let moduleFactory;

            if (tempModule instanceof NgModuleFactory) {
                // For AOT
                moduleFactory = tempModule;
            } else {
                // For JIT
                moduleFactory = await this.compiler.compileModuleAsync(
                    tempModule,
                );
            }

            const entryComponent = (moduleFactory.moduleType as any).entry;
            const moduleRef = moduleFactory.create(this.injector);

            loadedModule = {
                moduleName: name,
                componentFactory:
                    moduleRef.componentFactoryResolver.resolveComponentFactory(
                        entryComponent,
                    ),
            };

            this.loadedModules.push(loadedModule);
        }

        if (
            container &&
            container.createComponent &&
            loadedModule.componentFactory
        ) {
            container.createComponent(loadedModule.componentFactory);
        }

        return loadedModule.componentFactory;
    }
}
