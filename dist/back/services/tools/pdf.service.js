"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const nextalys_node_helpers_1 = require("nextalys-node-helpers");
const html_helpers_1 = require("nextalys-node-helpers/dist/html-helpers");
const pdf_helpers_1 = require("nextalys-node-helpers/dist/pdf-helpers");
const path = require("path");
const environment_1 = require("../../environment/environment");
const app_error_1 = require("../../models/app-error");
const pdf_response_1 = require("../../models/responses/pdf-response");
let PdfService = class PdfService {
    generatePdf(htmlTemplate, outputFileName, data, displayFileName, folder, opts, browserPdfOptions) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new pdf_response_1.GeneratePDFResponse();
            try {
                let outputFolder = environment_1.Environment.PdfPrivateOutputFolder;
                const htmlTemplatePathBase = path.join(environment_1.Environment.ApiBasePath, environment_1.Environment.HtmlTemplatesFolderName);
                if (folder) {
                    outputFolder = path.join(outputFolder, folder);
                }
                if (!(yield nextalys_node_helpers_1.FileHelpers.fileExists(outputFolder))) {
                    yield nextalys_node_helpers_1.FileHelpers.createDirectory(outputFolder);
                }
                const imagesFolder = path.join(htmlTemplatePathBase, 'images');
                if (yield nextalys_node_helpers_1.FileHelpers.isDirectory(imagesFolder)) {
                    yield nextalys_node_helpers_1.FileHelpers.copyFolderRecursive(imagesFolder, path.join(outputFolder, 'images'), { fullPathSpecified: true, replaceIfExists: true });
                }
                yield nextalys_node_helpers_1.FileHelpers.copyFolderRecursive(path.join(htmlTemplatePathBase, 'fonts'), path.join(outputFolder, 'fonts'), { fullPathSpecified: true, replaceIfExists: true });
                yield nextalys_node_helpers_1.FileHelpers.copyFolderRecursive(path.join(htmlTemplatePathBase, 'css'), path.join(outputFolder, 'css'), { fullPathSpecified: true, replaceIfExists: true });
                const htmlTemplatePath = path.join(htmlTemplatePathBase, htmlTemplate);
                if (!(yield nextalys_node_helpers_1.FileHelpers.fileExists(htmlTemplatePath))) {
                    throw new app_error_1.AppError('Cannot find template => ' + htmlTemplatePath);
                }
                if (data) {
                    html_helpers_1.HtmlHelpers.registerHandleBarsHelpers([
                        'formatDate',
                        'formatPrice',
                        'ifEquals',
                        'math',
                        'round',
                    ]);
                }
                const output = path.join(outputFolder, outputFileName);
                const pdfResponse = yield pdf_helpers_1.PDFHelpers.HtmlToPdfFromTemplate(htmlTemplatePath, data, output, environment_1.Environment.EnvName !== 'development', {
                    format: (opts === null || opts === void 0 ? void 0 : opts.format) || 'a4',
                    browserPdfOptions: browserPdfOptions,
                });
                if (pdfResponse.success) {
                    response.fullPath =
                        '/api/pdf/pdf?pdfFile=' +
                            (!!folder ? encodeURIComponent(folder + '/') : '') +
                            outputFileName +
                            (displayFileName ? '&fileName=' + displayFileName : '');
                    response.fileName = outputFileName;
                    response.success = true;
                    response.fullLocalPath = output;
                }
                else {
                    throw new app_error_1.AppError((_b = (_a = pdfResponse.error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : pdfResponse.error);
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    get(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path.join(environment_1.Environment.PdfPrivateOutputFolder, fileName);
            return (yield nextalys_node_helpers_1.FileHelpers.readFile(filePath, false));
        });
    }
    servePdfFile(pdfFile, res, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.get(pdfFile);
            if (!fileName)
                fileName = pdfFile;
            if (data) {
                res.header('Content-Type', 'application/pdf');
                res.header('Content-Disposition', `inline; filename="${fileName}"`);
                res.status(common_1.HttpStatus.OK).send(data);
            }
            else {
                res.status(common_1.HttpStatus.NOT_FOUND).send('Fichier introuvable');
            }
        });
    }
};
PdfService = __decorate([
    (0, common_1.Injectable)()
], PdfService);
exports.PdfService = PdfService;
//# sourceMappingURL=pdf.service.js.map