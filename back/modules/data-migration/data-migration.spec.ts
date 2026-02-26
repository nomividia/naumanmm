import { TestMainHelpers } from '../../test/test-main-helpers';
import { DataMigrationService } from './data-migration.service';

// async function testJobAdderfile(dataMigrationService: DataMigrationService, jobAdderOriginalFilename: string,
//     extension: string, storageName: string, mimeType: string
// ) {
//     const getFileResponse = await dataMigrationService.getAppFileFromJobAdderAttachment({
//         FileName: jobAdderOriginalFilename + '.' + extension,
//         StorageName: storageName,
//     } as any);
//     // console.log("Log ~ file: data-migration.spec.ts ~ line 11 ~ getFileResponse", getFileResponse);
//     expect(getFileResponse.success).toBeTruthy();
//     if (getFileResponse.success) {
//         expect(getFileResponse.file.name).toEqual(jobAdderOriginalFilename);
//         expect(getFileResponse.file.mimeType).toEqual(mimeType);
//     }
// }
describe('DataMigrationService tests', () => {
    let dataMigrationService: DataMigrationService;
    beforeAll(async () => {
        await TestMainHelpers.initTestingModule();
        dataMigrationService =
            TestMainHelpers.module.get<DataMigrationService>(
                DataMigrationService,
            );
    });

    // eslint-disable-next-line @typescript-eslint/require-await
    it('should get attachmentFileName', async () => {
        return;
        // await testJobAdderfile(dataMigrationService, 'test_nom_de_fichier1', 'pdf', '202101/33087195.original.pdf', 'application/pdf');
        // await testJobAdderfile(dataMigrationService, 'test_nom_de_fichier2', 'pages', '202101/33089893.original.pages', 'application/vnd.apple.pages');
        // await testJobAdderfile(dataMigrationService, 'test_nom_de_fichier3', 'png', '202101/33102086.original.png', 'image/png');
    });
});
