import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { DialogService } from 'nextalys-angular-tools';
import { FileUploadData, FileUploadOptions } from 'nextalys-file-upload';
import { MainHelpers } from 'nextalys-js-helpers';
import { environment } from '../../environments/environment';
import {
    AppImageDto,
    ImageService,
} from '../../providers/api-client.generated';
import { BaseComponent } from '../base/base.component';

@Component({
    selector: 'app-image-library',
    templateUrl: './image-library.component.html',
    styleUrls: ['./image-library.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ImageLibraryComponent extends BaseComponent {
    private initialSelectedImage: AppImageDto;
    public selectedImage: AppImageDto;
    public images: AppImageDto[];
    loading: boolean;

    fileUploadData: FileUploadData = {};

    @Input() fileUploadOptions: FileUploadOptions;

    @Output() imageSelectedChange = new EventEmitter<AppImageDto>();

    constructor(
        private imageService: ImageService,
        private dialogService: DialogService,
    ) {
        super();
        this.loadImages();
    }

    ngOnInit(): void {
        if (!this.fileUploadOptions) {
            this.fileUploadOptions = {};
        }

        this.fileUploadOptions.allowedFileTypes = ['image'];
        this.fileUploadOptions.url = environment.uploadImageUrl;
    }

    public async loadImages() {
        this.loading = true;
        const response = await this.imageService
            .getAllLibraryImages({})
            .toPromise();
        this.loading = false;

        if (response.success) {
            this.images = response.images;
        }
    }

    async onCompleteAll() {
        this.loading = false;
        if (
            !this.fileUploadData.fileItems ||
            this.fileUploadData.fileItems.length === 0
        ) {
            return;
        }
        let hasErrors = false;

        for (const fileItem of this.fileUploadData.fileItems) {
            if (fileItem.isError) {
                hasErrors = true;
                break;
            }
        }

        if (!hasErrors) {
            this.fileUploadOptions.controller.reset.next();
            await this.loadImages();
        }
    }

    isImageSelected(image: AppImageDto) {
        return this.selectedImage && this.selectedImage.id === image.id;
    }

    selectImage(image: AppImageDto) {
        this.selectedImage = image;
        this.initialSelectedImage = MainHelpers.cloneObject(this.selectedImage);
        this.imageSelectedChange.emit(image);
    }

    async resizeSelectedImage() {
        const dialogResult = await this.dialogService.showConfirmDialog(
            'Êtes-vous sûr de vouloir redimensionner cette image ?',
        );

        if (!dialogResult.okClicked) {
            return;
        }

        const response = await this.imageService
            .resizeImage({
                resizeAppImageRequest: {
                    image: this.selectedImage,
                    options: {
                        width: this.selectedImage.width,
                        height: this.selectedImage.height,
                    },
                },
            })
            .toPromise();

        if (!response.success) {
            this.dialogService.showDialog(response.message);
            this.selectedImage = MainHelpers.cloneObject(
                this.initialSelectedImage,
            );
        } else {
            this.selectedImage = null;
            this.loadImages();
        }
    }

    async removeSelectedImage() {
        const dialogResult = await this.dialogService.showConfirmDialog(
            'Êtes-vous sûr de vouloir supprimer cette image ?',
        );

        if (!dialogResult.okClicked) {
            return;
        }

        const response = await this.imageService
            .deleteImages({ ids: this.selectedImage.id })
            .toPromise();
        if (!response.success) {
            this.dialogService.showDialog(response.message);
        } else {
            this.selectedImage = null;
            this.loadImages();
        }
    }

    setHeightFromWidth() {
        const ratio =
            this.initialSelectedImage.height / this.initialSelectedImage.width;
        this.selectedImage.height = Math.round(
            this.selectedImage.width * ratio,
        );
    }

    setWidthFromHeight() {
        const ratio =
            this.initialSelectedImage.height / this.initialSelectedImage.width;
        this.selectedImage.width = Math.round(
            this.selectedImage.height / ratio,
        );
    }
}
