import cronstrue from 'cronstrue/i18n';
import { JobDto } from '../../providers/api-client.generated';

export class JobHelpers {
    static getCronDesc(job: JobDto | string) {
        let cronString = '';

        if (typeof job === 'string') {
            cronString = job;
        } else if (typeof job === 'object') {
            cronString = job?.cronPattern;
        }

        if (!cronString) {
            return 'Aucune périodicité';
        }

        let str = 'Périodicité incorrecte';

        try {
            str = cronstrue.toString(cronString, {
                locale: 'fr',
                verbose: true,
            });
        } catch (err) {}

        return str;
    }
}
