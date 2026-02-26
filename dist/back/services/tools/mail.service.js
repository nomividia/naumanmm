"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const nextalys_node_helpers_1 = require("nextalys-node-helpers");
const html_helpers_1 = require("nextalys-node-helpers/dist/html-helpers");
const mail_template_helpers_1 = require("nextalys-node-helpers/dist/mail-template-helpers");
const path = require("path");
const shared_constants_1 = require("../../../shared/shared-constants");
const environment_1 = require("../../environment/environment");
const app_error_1 = require("../../models/app-error");
const generic_response_1 = require("../../models/responses/generic-response");
const types_1 = require("../../shared/types");
const base_service_1 = require("../base-service");
const helpers_service_1 = require("./helpers.service");
const logger_service_1 = require("./logger.service");
let MailService = class MailService extends base_service_1.ApplicationBaseService {
    constructor() {
        super();
        this.isMailtrapProvider = false;
        this.isMailhogProvider = false;
        this.isMailtrapProvider = environment_1.Environment.SmtpHost === 'smtp.mailtrap.io';
        this.isMailhogProvider =
            environment_1.Environment.SmtpHost === 'localhost' &&
                environment_1.Environment.SmtpPort === 1025;
    }
    getMailProvider() {
        if (environment_1.Environment.SendInBlueApiKey &&
            environment_1.Environment.MailProvider === 'SendInBlue') {
            this.isMailtrapProvider = false;
            return new nextalys_node_helpers_1.SendInBlueMailProvider({
                sendInBlueApiKey: environment_1.Environment.SendInBlueApiKey,
                debug: true,
            });
        }
        this.isMailtrapProvider = environment_1.Environment.SmtpHost === 'smtp.mailtrap.io';
        this.isMailhogProvider =
            environment_1.Environment.SmtpHost === 'localhost' &&
                environment_1.Environment.SmtpPort === 1025;
        return new nextalys_node_helpers_1.SmtpMailProvider({
            smtpServer: environment_1.Environment.SmtpHost,
            smtpPort: environment_1.Environment.SmtpPort,
            smtpUser: environment_1.Environment.SmtpUser,
            smtpPassword: environment_1.Environment.SmtpPassword,
            secure: environment_1.Environment.SmtpSecure,
        });
    }
    prepareEmailData(emailData) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (!emailData.templateName)
                return;
            if (emailData.templateName === 'mail_auto') {
                emailData.useHandleBars = true;
            }
            const htmlTemplatePathBase = path.join(environment_1.Environment.ApiBasePath, environment_1.Environment.HtmlTemplatesFolderName);
            const fullPath = path.join(htmlTemplatePathBase, emailData.templateName + '.html');
            const templateContent = (yield nextalys_node_helpers_1.FileHelpers.readFile(fullPath, true));
            if (!templateContent) {
                throw new Error('Cannot find template ' + fullPath + ' or template is empty !');
            }
            if (!emailData.templateValues) {
                emailData.templateValues = {};
            }
            if (!emailData.htmlBody) {
                emailData.htmlBody = '';
            }
            if (emailData.templateValues.MAIL_BODY == null) {
                emailData.templateValues.MAIL_BODY = emailData.htmlBody;
            }
            if (emailData.templateValues.SITE_BASE_URL == null) {
                emailData.templateValues.SITE_BASE_URL = environment_1.Environment.BaseURL;
            }
            if (emailData.templateValues.language == null) {
                emailData.templateValues.language = shared_constants_1.defaultAppLanguage;
            }
            if (emailData.useHandleBars) {
                if (!emailData.handleBarsHelpers)
                    emailData.handleBarsHelpers = [];
                if (!((_a = emailData.handleBarsHelpers) === null || _a === void 0 ? void 0 : _a.some((x) => x === 'ifEquals'))) {
                    emailData.handleBarsHelpers.push('ifEquals');
                }
                if ((_b = emailData.handleBarsHelpers) === null || _b === void 0 ? void 0 : _b.length) {
                    html_helpers_1.HtmlHelpers.registerHandleBarsHelpers(emailData.handleBarsHelpers);
                }
                emailData.htmlBody =
                    yield html_helpers_1.HtmlHelpers.fillHtmlFromHtmlTemplateString(templateContent, emailData.templateValues, null, true);
            }
            else {
                let htmlBody = templateContent;
                for (const key in emailData.templateValues) {
                    if (Object.prototype.hasOwnProperty.call(emailData.templateValues, key)) {
                        const templateValue = emailData.templateValues[key];
                        htmlBody = nextalys_js_helpers_1.MainHelpers.replaceAll(htmlBody, '{{' + key + '}}', templateValue);
                    }
                }
                emailData.htmlBody = htmlBody;
            }
            if (emailData.compileMjmlTemplate) {
                const compileResult = yield mail_template_helpers_1.MailTemplateHelpers.compileMjmlToHtml({
                    inputString: emailData.htmlBody,
                });
                if (!((_c = compileResult.errors) === null || _c === void 0 ? void 0 : _c.length)) {
                    emailData.htmlBody = compileResult.html;
                }
            }
        });
    }
    sendMailWithGenericTemplate(emailData) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailDataClone = nextalys_js_helpers_1.MainHelpers.cloneObject(emailData);
            emailDataClone.templateName = 'generic-mail.mjml';
            emailDataClone.useHandleBars = true;
            emailDataClone.compileMjmlTemplate = true;
            return yield this.sendMail(emailDataClone);
        });
    }
    prepareMail(emailData) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                yield this.prepareEmailData(emailData);
                response.message = emailData.htmlBody;
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    canSendMail() {
        if (this.isMailhogProvider)
            return true;
        if (environment_1.Environment.IgnoreAllMailSending)
            return false;
        if (!this.isMailtrapProvider && environment_1.Environment.EnvName !== 'production') {
            return false;
        }
        return true;
    }
    sendMail(emailData) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                if (!this.canSendMail())
                    return new generic_response_1.GenericResponse(true);
                yield this.prepareEmailData(emailData);
                const sendMailResponse = yield this.getMailProvider().sendMail(emailData);
                response.success = sendMailResponse.success;
                if (!response.success) {
                    const errorDetails = {
                        error: sendMailResponse.error,
                        to: (_a = emailData.to) === null || _a === void 0 ? void 0 : _a.map((t) => t.address),
                        from: (_b = emailData.from) === null || _b === void 0 ? void 0 : _b.address,
                        subject: emailData.subject,
                        templateName: emailData.templateName,
                    };
                    yield logger_service_1.AppLogger.error('Unable to send mail', errorDetails);
                    response.message = ((_c = sendMailResponse.error) === null || _c === void 0 ? void 0 : _c.message)
                        || ((_d = sendMailResponse.error) === null || _d === void 0 ? void 0 : _d.toString())
                        || 'Unknown mail sending error';
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    sendNewsletter(emailData) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new types_1.SendNewsletterResponse();
            try {
                if (!this.canSendMail())
                    return new types_1.SendNewsletterResponse(true);
                yield this.prepareEmailData(emailData);
                const sendNewsletterResponse = yield this.getMailProvider().sendNewsletter(emailData);
                response.success = sendNewsletterResponse.success;
                yield logger_service_1.AppLogger.log('sendNewsletter response - success = ' +
                    sendNewsletterResponse.success, sendNewsletterResponse.data);
                response.newsletterId = (_a = sendNewsletterResponse === null || sendNewsletterResponse === void 0 ? void 0 : sendNewsletterResponse.data) === null || _a === void 0 ? void 0 : _a.newsletterId;
                response.listId = (_b = sendNewsletterResponse === null || sendNewsletterResponse === void 0 ? void 0 : sendNewsletterResponse.data) === null || _b === void 0 ? void 0 : _b.listId;
                if (!response.success) {
                    yield logger_service_1.AppLogger.loggerInstance.error('Unable to send newsletter', sendNewsletterResponse.error);
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    sendExistingNewsletter(newsletterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                if (!this.canSendMail())
                    return new generic_response_1.GenericResponse(true);
                const sendNewsletterResponse = yield this.getMailProvider().sendExistingNewsletter(newsletterId);
                response.success = sendNewsletterResponse.success;
                yield logger_service_1.AppLogger.log('sendExistingNewsletter response - success = ' +
                    sendNewsletterResponse.success);
                if (!response.success) {
                    yield logger_service_1.AppLogger.loggerInstance.error('Unable to send existing newsletter', sendNewsletterResponse.error);
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    createNewsletterList(emailData) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new types_1.SendNewsletterResponse();
            try {
                if (!this.canSendMail())
                    return new types_1.SendNewsletterResponse(true);
                if (emailData === null || emailData === void 0 ? void 0 : emailData.sendWithFileUrl) {
                    emailData.format = 'json';
                    const contactsFileName = nextalys_js_helpers_1.MainHelpers.generateGuid() + '.json';
                    const contactsFileUrl = environment_1.Environment.BaseURL +
                        '/' +
                        shared_constants_1.AppDirectories.Uploads +
                        '/' +
                        shared_constants_1.AppDirectories.Temp +
                        '/' +
                        contactsFileName;
                    const importContactsBody = this.getMailProvider().createImportContactBody({
                        to: emailData.to,
                        fileUrl: contactsFileUrl,
                        folder: 631,
                        format: emailData.format,
                        name: emailData.newsLetterName,
                    });
                    yield helpers_service_1.ApiMainHelpers.saveFileInPublicTempFolder(contactsFileName, importContactsBody);
                    emailData.fileUrl = contactsFileUrl;
                }
                emailData.newsLetterListFolder = 631;
                const newsletterResponse = yield this.getMailProvider().createNewsletterList(emailData);
                response.success = newsletterResponse.success;
                response.listId = (_a = newsletterResponse === null || newsletterResponse === void 0 ? void 0 : newsletterResponse.data) === null || _a === void 0 ? void 0 : _a.listId;
                yield logger_service_1.AppLogger.log('mail service - createNewsletterList response - success = ' +
                    newsletterResponse.success);
                if (!response.success) {
                    yield logger_service_1.AppLogger.loggerInstance.error('mail service - Unable to create newsletter list', newsletterResponse.error);
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    sendNewsletterWithListId(emailData, listId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new types_1.SendNewsletterResponse();
            try {
                if (!this.canSendMail())
                    return new types_1.SendNewsletterResponse(true);
                yield this.prepareEmailData(emailData);
                const newsletterResponse = yield this.getMailProvider().sendNewsletterWithListId(emailData, listId);
                response.success = newsletterResponse.success;
                response.listId = (_a = newsletterResponse.data) === null || _a === void 0 ? void 0 : _a.listId;
                response.newsletterId = (_b = newsletterResponse.data) === null || _b === void 0 ? void 0 : _b.newsletterId;
                yield logger_service_1.AppLogger.log('mail service - sendNewsletterWithListId response - success = ' +
                    newsletterResponse.success);
                if (!response.success) {
                    yield logger_service_1.AppLogger.loggerInstance.error('mail service - Unable to send newsletter', newsletterResponse.error);
                }
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    getNewsletter(newsletterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponseWithData();
            try {
                const newsletterResponse = yield this.getMailProvider().getNewsletter(newsletterId);
                response.success = newsletterResponse.success;
                response.data = newsletterResponse.data;
                response.error = newsletterResponse.error;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    getSibAccountData() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponseWithData();
            try {
                if (!environment_1.Environment.SendInBlueApiKey) {
                    throw new app_error_1.AppError('No SIB Api key !');
                }
                const client = new nextalys_node_helpers_1.NextalysNodeHttpClient();
                const httpResponse = yield client.request('https://api.sendinblue.com/v3/account', 'get', null, true, { 'api-key': environment_1.Environment.SendInBlueApiKey });
                response.data = httpResponse.data;
                response.success = true;
            }
            catch (err) {
                response.handleError(err);
            }
            return response;
        });
    }
    deleteBrevoContact(email) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = new generic_response_1.GenericResponse();
            try {
                if (!environment_1.Environment.SendInBlueApiKey) {
                    response.success = true;
                    return response;
                }
                if (!email) {
                    response.success = true;
                    return response;
                }
                const client = new nextalys_node_helpers_1.NextalysNodeHttpClient();
                const encodedEmail = encodeURIComponent(email);
                yield client.request(`https://api.brevo.com/v3/contacts/${encodedEmail}`, 'delete', null, true, { 'api-key': environment_1.Environment.SendInBlueApiKey });
                response.success = true;
                yield logger_service_1.AppLogger.log(`Brevo contact deleted successfully: ${email}`);
            }
            catch (err) {
                if (((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status) === 404 || (err === null || err === void 0 ? void 0 : err.statusCode) === 404) {
                    response.success = true;
                    yield logger_service_1.AppLogger.log(`Brevo contact not found (already deleted or never existed): ${email}`);
                }
                else {
                    yield logger_service_1.AppLogger.error(`Failed to delete Brevo contact: ${email}`, err);
                    response.success = false;
                    response.message = (err === null || err === void 0 ? void 0 : err.message) || 'Failed to delete Brevo contact';
                }
            }
            return response;
        });
    }
};
MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map