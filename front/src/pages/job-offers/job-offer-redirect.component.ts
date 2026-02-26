import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobOffersService } from '../../providers/api-client.generated';

@Component({
    selector: 'app-job-offer-redirect',
    template:
        '<div style="padding: 20px; text-align: center;">Redirection...</div>',
})
export class JobOfferRedirectComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private jobOfferService: JobOffersService,
    ) {}

    async ngOnInit() {
        const ref = this.route.snapshot.paramMap.get('ref');

        if (ref) {
            try {
                const response = await this.jobOfferService
                    .getJobOfferByRef({ ref: ref })
                    .toPromise();

                if (response?.success && response?.jobOffer?.id) {
                    this.router.navigate([
                        '/offres-emplois',
                        response.jobOffer.id,
                    ]);
                    return;
                }
            } catch (error) {
                console.error('Error looking up job offer by ref:', error);
            }
        }

        this.router.navigate(['/not-found']);
    }
}
