import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService, IDialogResult } from 'nextalys-angular-tools';
import {
    AddingFileFailedData,
    FileUploadData,
    FileUploadOptions,
} from 'nextalys-file-upload';
import { ImagesHelper } from '../../../../shared/images.helper';
import { RoutesList } from '../../../../shared/routes';
import { AppPage, AppTypes } from '../../../../shared/shared-constants';
import { GenericUnloadMessage } from '../../environments/constants';
import {
    AppFileDto,
    AppValueDto,
    CandidatesService,
    JobOffersService,
    UserDto,
    UserRoleDto,
    UsersRolesService,
    UsersService,
} from '../../providers/api-client.generated';
import { ReferentialProvider } from '../../providers/referential.provider';
import { BaseEditPageComponent } from '../base/base-edit-page.component';

interface EditModesInterface {
    informations: boolean;
    password: boolean;
    roles: boolean;
    photo: boolean;
}

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['../base/edit-page-style.scss', './edit-user.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class EditUserComponent
    extends BaseEditPageComponent<UserDto, UsersService>
    implements OnInit
{
    genderList: AppValueDto[];
    candidatePlacedCount: number;
    candidateLinkedCount: number;
    jobOfferLinkedCount: number;

    isNewUser = false;
    isUserEnable = true;
    defineNewPassword = false;
    photoSaving = false;
    photoUploadData: FileUploadData = {};
    rolesListWrapper: { role: string; roleLabel: string; checked: boolean }[] =
        [];
    editModes: EditModesInterface = {
        informations: false,
        password: false,
        roles: false,
        photo: false,
    };
    photoUploadOptions: FileUploadOptions = {
        allowedFileTypes: ['image'],
        filesCount: 1,
        maxWidth: 1200,
        usePica: true,
        maxWidthForThumbnails: 90,
    };

    ImagesHelper = ImagesHelper;

    get userRoles(): string {
        return (
            this.entity &&
            this.entity.roles &&
            this.entity.roles.map((x) => x.role).join(' / ')
        );
    }

    constructor(
        private usersService: UsersService,
        private usersRolesService: UsersRolesService,
        route: ActivatedRoute,
        router: Router,
        dialogService: DialogService,
        private referentialProvider: ReferentialProvider,
        private translate: TranslateService,
        private jobOfferService: JobOffersService,
        private candidateService: CandidatesService,
    ) {
        super(
            dialogService,
            AppPage.AdminEditUser,
            route,
            router,
            usersService,
            'userName',
            'user',
            'userDto',
            'getUser',
            'createOrUpdateUser',
            RoutesList.AdminUsers,
            'userName',
            null,
            GenericUnloadMessage,
        );
        this.init();
    }

    async init() {
        const routeParams = this.route.snapshot.params.userName;

        if (routeParams === 'new') {
            this.isNewUser = true;
            this.editModes = {
                informations: true,
                password: true,
                roles: true,
                photo: true,
            };
            this.unloadMessage =
                'Êtes vous certain de vouloir annuler la création de cet utilisateur ? Les modifications ne seront pas sauvegardées';
        }

        this.genderList = await this.referentialProvider.getTypeValues(
            AppTypes.PersonGenderCode,
            true,
        );
    }

    getSaveMethodName() {
        if (
            this.entity?.id &&
            this.entity.id === this.AuthDataService.currentUser?.id
        ) {
            return 'updateMyUserProfile';
        }

        return 'createOrUpdateUser';
    }

    async afterInitEditPageData() {
        const userRolesResponse = await this.usersRolesService
            .getUserRoles({ includeDisabled: 'false' })
            .toPromise();

        if (userRolesResponse.success) {
            this.rolesListWrapper = userRolesResponse.userRoles.map((x) => ({
                role: x.role,
                checked: false,
                roleLabel: x.label,
            }));

            if (
                this.entityRefFieldValue !== 'new' &&
                this.entity &&
                this.rolesListWrapper
            ) {
                this.rolesListWrapper.forEach((x) => {
                    if (
                        this.entity.roles &&
                        this.entity.roles.map((y) => y.role).indexOf(x.role) !==
                            -1
                    ) {
                        x.checked = true;
                    }
                });
            }

            if (this.entity?.disabled) {
                this.isUserEnable = false;
            }
        }

        await this.getUserStat();
    }

    beforeSaveCheck() {
        const errors: string[] = [];

        if (this.editModes.informations) {
            if (!this.entity.firstName) {
                errors.push(this.translate.instant('UserErrors.FirstName'));
            }

            if (!this.entity.lastName) {
                errors.push(this.translate.instant('UserErrors.LastName'));
            }

            if (!this.entity.userName) {
                errors.push(this.translate.instant('UserErrors.UserName'));
            }

            if (!this.entity.genderId) {
                errors.push(this.translate.instant('UserErrors.Gender'));
            }

            if (!this.entity.mail) {
                errors.push(this.translate.instant('UserErrors.Email'));
            }
            // if (!this.entity.phone)
            //     errors.push(this.translate.instant('UserErrors.Phone'));
        }

        if (this.editModes.password) {
            if (!this.entity.password) {
                errors.push(this.translate.instant('UserErrors.Password'));
            }
        }

        return errors;
    }

    async archiveOrActiveUser() {
        let dialogResult: IDialogResult;

        if (!this.entity.disabled) {
            dialogResult = await this.dialogService.showConfirmDialog(
                'Êtes-vous sûr de vouloir archiver cet utilisateur ?',
            );
        } else
            dialogResult = await this.dialogService.showConfirmDialog(
                'Êtes-vous sûr de vouloir activer cet utilisateur ?',
            );
        if (!dialogResult.okClicked) {
            return;
        }

        this.entity.disabled = !this.entity.disabled;
        this.save();
    }

    onEditClick(key: keyof EditModesInterface) {
        if (this.editModes[key]) {
            const errors = this.beforeSaveCheck();

            if (errors.length) {
                this.dialogService.showDialog(
                    this.translate.instant('Errors.NeedToFillList') +
                        '<ul>' +
                        errors.map((x) => (x = '<li>' + x + '</li>')).join('') +
                        '</ul>',
                );

                return;
            }

            this.save();
        }

        this.editModes[key] = !this.editModes[key];
    }
    async save(exit?: boolean): Promise<any> {
        if (!this.hasPendingModifications) {
            return;
        }

        if (this.photoUploadData?.fileItems?.length) {
            const mainResumeFiles: AppFileDto[] =
                this.photoUploadData.fileItems.map<AppFileDto>((x) => ({
                    physicalName: x.file.name,
                    name: x.alias,
                    mimeType: x.file.type,
                }));
            this.photoSaving = true;
            this.entity.image = mainResumeFiles[0];
        }

        this.entity.roles = this.rolesListWrapper
            .filter((x) => x.checked)
            .map<UserRoleDto>((x) => ({
                id: null,
                role: x.role,
                enabled: true,
            }));

        const saveResponse = await super.save(exit);

        if (saveResponse) {
            this.defineNewPassword = false;

            for (const key in this.editModes) {
                this.editModes[key as keyof EditModesInterface] = false;
            }

            this.photoUploadData.fileItems = [];
            this.photoUploadOptions.controller?.reset?.next();
            this.isNewUser = false;
            // console.log("Log ~ file: edit-user.component.ts ~ line 165 ~ EditUserComponent ~ save ~   this.isNewUser", this.isNewUser);
            this.photoSaving = false;
        }

        return saveResponse;
    }

    async changeUserStatut() {
        this.entity.disabled = !this.isUserEnable;
        await super.save();
    }

    onCompleteItems() {
        // this.loading = true;
        // const files: AppFileDto[] = this.photoUploadData.fileItems.map<AppFileDto>(x => ({ physicalName: x.file.name, name: x.alias, mimeType: x.file.type }));
        // console.log("Log ~ file: candidate-apply-form.component.ts ~ line 131 ~ CandidateApplyForm ~ onCompleteItems ~ files", files);
        this.hasPendingModifications = true;
        this.loading = false;
    }

    onAddingFileFailed(data: AddingFileFailedData) {
        if (data?.code === 'incorrectFileType') {
            this.dialogService.showDialog(
                this.translate.instant('Global.IncorrectFileType'),
            );
        }
        this.loading = false;
    }

    async deleteUser() {
        const dialog = await this.dialogService.showConfirmDialog(
            this.translate.instant('Dialog.RemoveUser'),
            { okLabel: 'Global.Yes', cancelLabel: 'Global.No' },
        );

        if (dialog.cancelClicked) {
            return;
        }

        this.loading = true;

        const deleteUserResponse = await this.usersService
            .deleteUsers({ userIds: this.entity.id })
            .toPromise();

        if (!deleteUserResponse.success) {
            return this.dialogService.showDialog(deleteUserResponse.message);
        }

        this.loading = false;
        this.router.navigateByUrl('/' + RoutesList.AdminUsers);
    }

    async getUserStat() {
        if (!this.entity?.id) {
            return;
        }

        this.loading = true;

        const userStatResponse = await this.usersService
            .getConsultantStats({ userId: this.entity.id })
            .toPromise();

        if (userStatResponse.success) {
            this.jobOfferLinkedCount = userStatResponse.jobOfferLinked;
            this.candidateLinkedCount = userStatResponse.candidateLinked;
            this.candidatePlacedCount = userStatResponse.candidatePlaced;
        }

        this.loading = false;
    }

    redirectWithLinkedConsultant() {
        if (!this.entity?.id) {
            return;
        }

        this.router.navigate([RoutesList.CandidatesList], {
            queryParams: { consultantIds: this.entity.id },
        });
    }
}
