import { AfterViewInit, Component } from '@angular/core';

declare let Chart: any;

@Component({
    selector: 'app-application-source-list',

    templateUrl: './application-source-list.component.html',
    styleUrls: ['./application-source-list.component.scss'],
})
export class ApplicationSourceListComponent implements AfterViewInit {
    public barChart: any;

    ngAfterViewInit() {
        this.createBarChart();
    }

    createBarChart() {
        const ctx = document.getElementById('myBarChart') as HTMLCanvasElement;
        this.barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [
                    'INDEED',
                    'LINKEDIN',
                    'NANNY JOB',
                    'WEBSITE',
                    'OTHERS',
                ],
                datasets: [
                    {
                        label: 'PLATFORM',
                        data: [625, 549, 801, 418, 956],
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }
}
