import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class MaintenanceInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const url: string = context?.switchToHttp()?.getRequest()?.url;
        // console.log("Log ~ MaintenanceInterceptor ~ intercept ~ url:", url);
        if (url && url.startsWith('/api')) {
            return context
                .switchToHttp()
                .getResponse()
                .status(582)
                .send({
                    success: false,
                    message: 'Maintenance Mode',
                    statusCode: 582,
                });
        }
        // console.log("Log ~ MaintenanceInterceptor ~ intercept ~ context:", context.switchToHttp().getRequest().url);
        return next.handle();
        // const request = context.switchToHttp().getRequest();
        // // console.log("Log: LoggingInterceptor -> request", request.body);
        // return next
        //     .handle();
    }
}
