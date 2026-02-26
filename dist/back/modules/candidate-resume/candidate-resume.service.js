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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.CandidateResumeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const fs = require("fs");
const nextalys_js_helpers_1 = require("nextalys-js-helpers");
const nextalys_node_helpers_1 = require("nextalys-node-helpers");
const path = require("path");
const PDFDocument = require("pdfkit");
const typeorm_2 = require("typeorm");
const images_helper_1 = require("../../../shared/images.helper");
const nationality_helper_1 = require("../../../shared/nationality-helper");
const shared_constants_1 = require("../../../shared/shared-constants");
const constants_1 = require("../../environment/constants");
const environment_1 = require("../../environment/environment");
const candidate_entity_1 = require("../candidates/candidate.entity");
const gcloud_storage_service_1 = require("../gdrive/gcloud-storage-service");
let CandidateResumeService = class CandidateResumeService {
    constructor(candidateRepository, gCloudStorageService) {
        this.candidateRepository = candidateRepository;
        this.gCloudStorageService = gCloudStorageService;
    }
    generateCandidateResume(candidateId, body) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield this.candidateRepository
                .createQueryBuilder('candidate')
                .select([
                'candidate.id',
                'candidate.firstName',
                'candidate.birthDate',
                'candidate.nationality',
                'candidate.skills',
            ])
                .leftJoin('candidate.gender', 'gender')
                .addSelect(['gender.code'])
                .leftJoin('candidate.addresses', 'addresses')
                .addSelect([
                'addresses.city',
                'addresses.department',
                'addresses.country',
            ])
                .leftJoin('candidate.candidateCurrentJobs', 'candidateCurrentJobs')
                .addSelect([
                'candidateCurrentJobs.id',
                'candidateCurrentJobs.currentJobId',
            ])
                .leftJoin('candidateCurrentJobs.currentJob', 'currentJob')
                .addSelect(['currentJob.id', 'currentJob.label'])
                .leftJoin('currentJob.translations', 'currentJobTranslations')
                .addSelect([
                'currentJobTranslations.id',
                'currentJobTranslations.entityField',
                'currentJobTranslations.languageId',
                'currentJobTranslations.value',
            ])
                .leftJoin('candidate.candidateLanguages', 'candidateLanguages')
                .addSelect(['candidateLanguages.languageCode'])
                .leftJoin('candidateLanguages.levelLanguage', 'levelLanguage')
                .addSelect(['levelLanguage.label'])
                .leftJoin('levelLanguage.translations', 'levelLanguageTranslations')
                .addSelect([
                'levelLanguageTranslations.id',
                'levelLanguageTranslations.entityField',
                'levelLanguageTranslations.languageId',
                'levelLanguageTranslations.value',
            ])
                .leftJoin('candidate.candidateJobs', 'candidateJobs')
                .addSelect([
                'candidateJobs.id',
                'candidateJobs.type',
                'candidateJobs.experienceStartDate',
                'candidateJobs.experienceEndDate',
                'candidateJobs.showMonthInResume',
                'candidateJobs.jobName',
                'candidateJobs.jobDescription',
            ])
                .addOrderBy('candidateJobs.experienceStartDate', 'DESC')
                .addOrderBy('candidateJobs.experienceEndDate', 'DESC')
                .leftJoin('candidateJobs.job', 'job')
                .addSelect(['job.id', 'job.label'])
                .leftJoin('job.translations', 'jobTranslations')
                .addSelect([
                'jobTranslations.id',
                'jobTranslations.entityField',
                'jobTranslations.languageId',
                'jobTranslations.value',
            ])
                .leftJoin('candidateJobs.jobReference', 'jobReference')
                .addSelect([
                'jobReference.id',
                'jobReference.companyName',
                'jobReference.note',
            ])
                .leftJoin('jobReference.addresses', 'jobReferenceAddresses')
                .addSelect(['jobReferenceAddresses.city'])
                .leftJoin('candidate.files', 'files')
                .addSelect(['files.id'])
                .leftJoin('files.file', 'file')
                .addSelect([
                'file.id',
                'file.physicalName',
                'file.externalFilePath',
                'file.mimeType',
                'file.name',
                'file.size',
            ])
                .leftJoin('files.fileType', 'fileType')
                .addSelect(['fileType.code'])
                .leftJoin('candidate.presentations', 'presentations')
                .addSelect([
                'presentations.id',
                'presentations.title',
                'presentations.content',
                'presentations.isDefault',
            ])
                .where('candidate.id = :candidateId', { candidateId })
                .getOne();
            const imagePath = images_helper_1.ImagesHelper.candidateProfilePicture(candidate);
            const candidatePicture = images_helper_1.ImagesHelper.getCandidatePicture(candidate);
            const country = ((_b = (_a = candidate.addresses[0]) === null || _a === void 0 ? void 0 : _a.country) === null || _b === void 0 ? void 0 : _b.trim()) || '';
            const displayCountry = country === 'AE' ? 'UAE' : country;
            const references = candidate.candidateJobs
                .filter((candidateJob) => { var _a; return (_a = candidateJob.jobReference) === null || _a === void 0 ? void 0 : _a.note; })
                .map((candidateJob) => { var _a; return (_a = candidateJob.jobReference) === null || _a === void 0 ? void 0 : _a.note; });
            let presentationContent = candidate.skills || '';
            if (candidate.presentations && candidate.presentations.length > 0) {
                if (body.selectedPresentationId) {
                    const selectedPresentation = candidate.presentations.find((p) => p.id === body.selectedPresentationId);
                    if (selectedPresentation) {
                        presentationContent = selectedPresentation.content || '';
                    }
                }
                else {
                    const defaultPresentation = candidate.presentations.find((p) => p.isDefault);
                    if (defaultPresentation) {
                        presentationContent = defaultPresentation.content || '';
                    }
                    else {
                        presentationContent =
                            ((_c = candidate.presentations[0]) === null || _c === void 0 ? void 0 : _c.content) || '';
                    }
                }
            }
            const maxPresentationLength = 1500;
            if (presentationContent.length > maxPresentationLength) {
                presentationContent =
                    presentationContent.substring(0, maxPresentationLength - 3) +
                        '...';
            }
            const pdfData = {
                isFR: body.language === 'fr',
                firstName: candidate.firstName,
                showAge: body.showAge,
                showNationality: body.showNationality,
                age: nextalys_js_helpers_1.DateHelpers.getAge(new Date(candidate.birthDate)),
                nationality: (0, nationality_helper_1.getNationality)(candidate.nationality || ((_d = candidate.addresses[0]) === null || _d === void 0 ? void 0 : _d.country), body.language, ((_e = candidate.gender) === null || _e === void 0 ? void 0 : _e.code) === shared_constants_1.PersonGender.Male ? 'm' : 'f'),
                city: ((_g = (_f = candidate.addresses[0]) === null || _f === void 0 ? void 0 : _f.city) === null || _g === void 0 ? void 0 : _g.trim()) || '',
                state: ((_j = (_h = candidate.addresses[0]) === null || _h === void 0 ? void 0 : _h.department) === null || _j === void 0 ? void 0 : _j.trim()) || '',
                country,
                displayCountry,
                showState: country === 'US',
                candidatePresentation: presentationContent,
                hasPicture: ((_k = imagePath === null || imagePath === void 0 ? void 0 : imagePath.file) === null || _k === void 0 ? void 0 : _k.physicalName) ? true : false,
                candidatePictureUrl: candidatePicture,
                hasLanguage: candidate.candidateLanguages.length > 0,
                languages: this.getCandidateLanguages(candidate.candidateLanguages, body.language),
                jobTitle: this.getJobTitleTranslation((_l = candidate.candidateCurrentJobs.find((x) => x.currentJob.id === body.selectedJobId)) === null || _l === void 0 ? void 0 : _l.currentJob, body.language),
                references,
                hasReferences: references.length > 0,
                candidateJobs: candidate.candidateJobs
                    .filter((candidateJob) => candidateJob.jobReference &&
                    candidateJob.type === 'JOB')
                    .map((candidateJob) => {
                    var _a, _b;
                    return ({
                        startDate: candidateJob.experienceStartDate
                            ? this.formatDate(candidateJob.experienceStartDate, candidateJob.showMonthInResume
                                ? 'year-month'
                                : 'year', body.language)
                            : '',
                        endDate: candidateJob.experienceEndDate
                            ? this.formatDate(candidateJob.experienceEndDate, candidateJob.showMonthInResume
                                ? 'year-month'
                                : 'year', body.language)
                            : '',
                        jobReference: {
                            jobTitle: candidateJob.jobName ||
                                this.getJobTitleTranslation(candidateJob.job, body.language),
                            companyName: candidateJob.jobReference.companyName || '',
                            location: ((_b = (_a = candidateJob.jobReference.addresses) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.city) ||
                                '',
                            description: this.normalizeJobDescription(candidateJob.jobDescription || ''),
                        },
                    });
                }),
                candidateEducation: candidate.candidateJobs
                    .filter((candidateJob) => candidateJob.jobReference &&
                    candidateJob.type === 'EDUCATION')
                    .map((candidateJob) => {
                    var _a, _b;
                    return ({
                        startDate: candidateJob.experienceStartDate
                            ? this.formatDate(candidateJob.experienceStartDate, candidateJob.showMonthInResume
                                ? 'year-month'
                                : 'year', body.language)
                            : '',
                        endDate: candidateJob.experienceEndDate
                            ? this.formatDate(candidateJob.experienceEndDate, candidateJob.showMonthInResume
                                ? 'year-month'
                                : 'year', body.language)
                            : '',
                        jobReference: {
                            jobTitle: candidateJob.jobName ||
                                this.getJobTitleTranslation(candidateJob.job, body.language),
                            companyName: candidateJob.jobReference.companyName || '',
                            location: ((_b = (_a = candidateJob.jobReference.addresses) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.city) ||
                                '',
                            description: this.normalizeJobDescription(candidateJob.jobDescription || ''),
                        },
                    });
                }),
            };
            const pdfBuffer = yield this.generatePdfWithPDFKit(pdfData, candidate);
            const outputFolder = path.join(environment_1.Environment.PdfPrivateOutputFolder, constants_1.resumesCandidatePdfFolder);
            if (!(yield nextalys_node_helpers_1.FileHelpers.fileExists(outputFolder))) {
                yield nextalys_node_helpers_1.FileHelpers.createDirectory(outputFolder);
            }
            const outputPath = path.join(outputFolder, candidate.id + '.pdf');
            yield nextalys_node_helpers_1.FileHelpers.writeFile(outputPath, pdfBuffer);
            return {
                buffer: pdfBuffer,
                fileName: `${candidate.firstName}_resume.pdf`,
                mimeType: 'application/pdf',
            };
        });
    }
    generatePdfWithPDFKit(data, candidate) {
        return __awaiter(this, void 0, void 0, function* () {
            let candidatePicturePath = null;
            if (data.hasPicture) {
                const profilePictureFile = images_helper_1.ImagesHelper.candidateProfilePicture(candidate);
                candidatePicturePath = yield this.resolveCandidatePicturePath(candidate.id, profilePictureFile);
            }
            return new Promise((resolve, reject) => {
                try {
                    const doc = new PDFDocument({
                        size: 'A4',
                        margins: { top: 30, bottom: 90, left: 60, right: 60 },
                        bufferPages: true,
                    });
                    const chunks = [];
                    doc.on('data', (chunk) => chunks.push(chunk));
                    doc.on('end', () => resolve(Buffer.concat(chunks)));
                    doc.on('error', reject);
                    const pagesCreated = [];
                    let currentSection = 'other';
                    let lastKnownPage = 0;
                    const htmlTemplatesPath = path.join(environment_1.Environment.ApiBasePath, environment_1.Environment.HtmlTemplatesFolderName);
                    const fontsPath = path.join(htmlTemplatesPath, 'fonts');
                    const imagesPath = path.join(htmlTemplatesPath, 'images');
                    doc.registerFont('Bodoni-Bold', path.join(fontsPath, 'BodoniFerraraOrigin-Bold.otf'));
                    doc.registerFont('Bodoni-Regular', path.join(fontsPath, 'BodoniFerraraOrigin-Regular.otf'));
                    doc.registerFont('Metropolis-Bold', path.join(fontsPath, 'Metropolis-Bold.otf'));
                    doc.registerFont('Metropolis-Medium', path.join(fontsPath, 'Metropolis-Medium.otf'));
                    doc.registerFont('Metropolis-Regular', path.join(fontsPath, 'Metropolis-Regular.otf'));
                    doc.registerFont('Avenir-Heavy', path.join(fontsPath, 'Avenir Heavy.ttf'));
                    doc.registerFont('Avenir-Book', path.join(fontsPath, 'Avenir Book.ttf'));
                    const primaryColor = '#131e48';
                    const backgroundColor = '#faf8f3';
                    const accentColor = '#e8dec6';
                    const drawHeader = (yPosition = 0) => {
                        const savedY = doc.y;
                        doc.rect(0, yPosition, doc.page.width, 90).fill('#0b153b');
                        doc.font('Metropolis-Medium')
                            .fontSize(8)
                            .fillColor('white')
                            .text(data.isFR
                            ? 'MEILLEURS CANDIDATS POUR LE POSTE DE'
                            : 'TOP CV CANDIDATES FOR', 60, yPosition + 35, { width: 350, lineBreak: false });
                        doc.font('Bodoni-Bold')
                            .fontSize(18)
                            .text(data.jobTitle, 60, yPosition + 50, {
                            width: 350,
                            lineBreak: false,
                        });
                        doc.font('Metropolis-Medium')
                            .fontSize(7)
                            .text(data.isFR ? 'PRÉSENTÉ PAR' : 'PRESENTED BY', doc.page.width - 180, yPosition + 35, { width: 120, align: 'right', lineBreak: false });
                        doc.font('Bodoni-Bold')
                            .fontSize(18)
                            .text('Morgan & Mallet', doc.page.width - 180, yPosition + 50, { width: 120, align: 'right', lineBreak: false });
                        doc.y = savedY;
                    };
                    const estimateTextHeight = (text, width, fontSize = 10, font = 'Avenir-Book') => {
                        doc.font(font).fontSize(fontSize);
                        const height = doc.heightOfString(text, {
                            width: width,
                            align: 'justify',
                        });
                        return height;
                    };
                    const startNewSectionPage = (sectionTitle) => {
                        doc.addPage();
                        lastKnownPage = doc.bufferedPageRange().count - 1;
                        drawHeader();
                        pagesCreated.push(pagesCreated.length);
                        doc.font('Metropolis-Regular')
                            .fontSize(13)
                            .fillColor(primaryColor)
                            .text(sectionTitle, 60, 170, {
                            characterSpacing: 1.5,
                        });
                        return 195;
                    };
                    const renderTextWithPageBreaks = (text, x, y, width, options = {}) => {
                        const pageBottomMargin = 150;
                        const maxHeight = doc.page.height - pageBottomMargin;
                        let currentY = y;
                        const lines = text.split('\n');
                        for (const line of lines) {
                            if (!line.trim()) {
                                currentY += 12;
                                continue;
                            }
                            const testY = doc.y;
                            doc.y = currentY;
                            const heightOfLine = doc.heightOfString(line, Object.assign({ width: width }, options));
                            doc.y = testY;
                            if (currentY + heightOfLine > maxHeight) {
                                let sectionTitle = '';
                                if (currentSection === 'experience') {
                                    sectionTitle = data.isFR
                                        ? 'EXPÉRIENCE PROFESSIONNELLE (suite)'
                                        : 'PROFESSIONAL EXPERIENCE (continued)';
                                }
                                else if (currentSection === 'education') {
                                    sectionTitle = data.isFR
                                        ? 'FORMATION (suite)'
                                        : 'EDUCATION (continued)';
                                }
                                currentY = startNewSectionPage(sectionTitle);
                            }
                            doc.font(options.font || 'Avenir-Book')
                                .fontSize(options.fontSize || 10)
                                .fillColor(options.fillColor || primaryColor)
                                .text(line, x, currentY, {
                                width: width,
                                align: options.align || 'justify',
                            });
                            currentY = doc.y;
                        }
                        return currentY;
                    };
                    const parseHtmlBlocks = (html) => {
                        const blocks = [];
                        const blockRegex = /<(p|h[1-3]|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>|<(br)\s*\/?>/gi;
                        let match;
                        while ((match = blockRegex.exec(html)) !== null) {
                            const tag = (match[1] || match[3]).toLowerCase();
                            const content = match[2] || '';
                            if (tag === 'ul' || tag === 'ol') {
                                blocks.push({ tag, content: '' });
                                const liRegex = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
                                let liMatch;
                                while ((liMatch = liRegex.exec(content)) !== null) {
                                    blocks.push({
                                        tag: 'li',
                                        content: liMatch[1],
                                    });
                                }
                            }
                            else {
                                blocks.push({ tag, content });
                            }
                        }
                        if (blocks.length === 0 && html.trim()) {
                            blocks.push({
                                tag: 'p',
                                content: html.replace(/<[^>]*>/g, ''),
                            });
                        }
                        return blocks;
                    };
                    const parseInlineFormatting = (html) => {
                        const segments = [];
                        const parts = html.split(/(<\/?(?:strong|b)>)/gi);
                        let isBold = false;
                        for (const part of parts) {
                            if (/^<(strong|b)>$/i.test(part)) {
                                isBold = true;
                                continue;
                            }
                            if (/^<\/(strong|b)>$/i.test(part)) {
                                isBold = false;
                                continue;
                            }
                            const cleanText = part.replace(/<[^>]*>/g, '');
                            if (cleanText) {
                                segments.push({ text: cleanText, bold: isBold });
                            }
                        }
                        if (segments.length === 0) {
                            segments.push({
                                text: html.replace(/<[^>]*>/g, ''),
                                bold: false,
                            });
                        }
                        return segments;
                    };
                    const renderHtmlWithPageBreaks = (html, x, y, width, baseOptions = {}) => {
                        const pageBottomMargin = 150;
                        const maxHeight = doc.page.height - pageBottomMargin;
                        let currentY = y;
                        const baseFontSize = baseOptions.fontSize || 10;
                        const baseFont = baseOptions.font || 'Avenir-Book';
                        const boldFont = 'Avenir-Heavy';
                        const color = baseOptions.fillColor || primaryColor;
                        html = html.trim();
                        const blocks = parseHtmlBlocks(html);
                        let listCounter = 0;
                        let inOrderedList = false;
                        for (const block of blocks) {
                            let font = baseFont;
                            let fontSize = baseFontSize;
                            let indent = 0;
                            let prefix = '';
                            switch (block.tag) {
                                case 'h1':
                                    font = boldFont;
                                    fontSize = 14;
                                    break;
                                case 'h2':
                                    font = boldFont;
                                    fontSize = 12;
                                    break;
                                case 'h3':
                                    font = boldFont;
                                    fontSize = 11;
                                    break;
                                case 'li':
                                    indent = 15;
                                    if (inOrderedList) {
                                        listCounter++;
                                        prefix = `${listCounter}. `;
                                    }
                                    else {
                                        prefix = '\u2022 ';
                                    }
                                    break;
                                case 'ul':
                                    inOrderedList = false;
                                    listCounter = 0;
                                    continue;
                                case 'ol':
                                    inOrderedList = true;
                                    listCounter = 0;
                                    continue;
                                case 'br':
                                    currentY += 8;
                                    continue;
                                case 'p':
                                default:
                                    break;
                            }
                            const segments = parseInlineFormatting(block.content);
                            const fullText = prefix + segments.map((s) => s.text).join('');
                            if (!fullText.trim()) {
                                currentY += 8;
                                continue;
                            }
                            const estimatedHeight = doc.heightOfString(fullText, {
                                width: width - indent,
                            });
                            if (currentY + estimatedHeight > maxHeight) {
                                let sectionTitle = '';
                                if (currentSection === 'experience') {
                                    sectionTitle = data.isFR
                                        ? 'EXPÉRIENCE PROFESSIONNELLE (suite)'
                                        : 'PROFESSIONAL EXPERIENCE (continued)';
                                }
                                else if (currentSection === 'education') {
                                    sectionTitle = data.isFR
                                        ? 'FORMATION (suite)'
                                        : 'EDUCATION (continued)';
                                }
                                currentY = startNewSectionPage(sectionTitle);
                            }
                            if (prefix) {
                                doc.font(font)
                                    .fontSize(fontSize)
                                    .fillColor(color)
                                    .text(prefix, x, currentY, {
                                    width: indent,
                                    continued: false,
                                });
                            }
                            const textX = x + indent;
                            for (let i = 0; i < segments.length; i++) {
                                const seg = segments[i];
                                const segFont = seg.bold ? boldFont : font;
                                const isLast = i === segments.length - 1;
                                doc.font(segFont)
                                    .fontSize(fontSize)
                                    .fillColor(color)
                                    .text(seg.text, i === 0 ? textX : undefined, i === 0 ? currentY : undefined, {
                                    width: width - indent,
                                    align: baseOptions.align || 'left',
                                    continued: !isLast,
                                });
                            }
                            currentY =
                                doc.y + (block.tag === 'li' ? 4 : 8);
                        }
                        return currentY;
                    };
                    drawHeader();
                    pagesCreated.push(0);
                    lastKnownPage = 0;
                    let currentY = 90;
                    doc.rect(0, currentY, doc.page.width, 140).fill(backgroundColor);
                    doc.font('Avenir-Heavy')
                        .fontSize(18)
                        .fillColor(primaryColor)
                        .text(data.firstName.toUpperCase(), 60, currentY + 25, {
                        characterSpacing: 2,
                    });
                    currentY += 50;
                    let locationText = '';
                    if (data.city) {
                        locationText = data.city;
                        if (data.showState)
                            locationText += `, ${data.state}`;
                        locationText += `, ${data.displayCountry}`;
                    }
                    else if (data.showState) {
                        locationText = `${data.state}, ${data.displayCountry}`;
                    }
                    else {
                        locationText = data.displayCountry;
                    }
                    doc.font('Avenir-Heavy')
                        .fontSize(10)
                        .text(locationText, 60, currentY);
                    currentY += 10;
                    let personalInfo = '';
                    if (data.showNationality) {
                        personalInfo += data.nationality;
                    }
                    if (data.showAge) {
                        if (personalInfo)
                            personalInfo += ', ';
                        personalInfo += data.isFR
                            ? `${data.age} ans`
                            : `${data.age} years old`;
                    }
                    if (personalInfo) {
                        doc.text(personalInfo, 60, currentY);
                        currentY += 10;
                    }
                    if (data.hasLanguage) {
                        const languagesText = (data.isFR ? 'Langues : ' : 'Languages : ') +
                            data.languages
                                .map((l) => `${l.languageName} - ${l.level}`)
                                .join(', ');
                        doc.text(languagesText, 60, currentY, { width: 350 });
                    }
                    if (candidatePicturePath &&
                        fs.existsSync(candidatePicturePath)) {
                        try {
                            doc.image(candidatePicturePath, doc.page.width - 170, 105, {
                                width: 110,
                                height: 110,
                            });
                        }
                        catch (e) {
                            console.error('Error adding candidate picture to PDF:', e);
                        }
                    }
                    currentY = 280;
                    doc.font('Metropolis-Regular')
                        .fontSize(13)
                        .fillColor(primaryColor)
                        .text(data.isFR ? 'PRÉSENTATION' : 'PRESENTATION', 60, currentY, { characterSpacing: 1.5 });
                    currentY += 25;
                    doc.font('Avenir-Book')
                        .fontSize(10)
                        .text(data.candidatePresentation || '', 60, currentY, {
                        width: doc.page.width - 120,
                        align: 'justify',
                    });
                    currentY = doc.y + 40;
                    doc.font('Metropolis-Regular')
                        .fontSize(13)
                        .fillColor(primaryColor)
                        .text(data.isFR ? 'RÉFÉRENCES' : 'REFERENCES', 60, currentY, {
                        characterSpacing: 1.5,
                    });
                    currentY += 25;
                    if (data.hasReferences) {
                        data.references.forEach((ref, index) => {
                            doc.font('Avenir-Book')
                                .fontSize(10)
                                .text(ref, 60, currentY, {
                                width: doc.page.width - 120,
                                align: 'justify',
                                lineGap: -1,
                            });
                            currentY = doc.y + 15;
                        });
                    }
                    else {
                        doc.font('Avenir-Book')
                            .fontSize(10)
                            .text(data.isFR
                            ? 'Références disponibles sur demande'
                            : 'References available on request', 60, currentY, { width: doc.page.width - 120 });
                    }
                    currentSection = 'experience';
                    doc.addPage();
                    lastKnownPage = doc.bufferedPageRange().count - 1;
                    drawHeader();
                    pagesCreated.push(pagesCreated.length);
                    currentY = 170;
                    doc.font('Metropolis-Regular')
                        .fontSize(13)
                        .fillColor(primaryColor)
                        .text(data.isFR
                        ? 'EXPÉRIENCE PROFESSIONNELLE'
                        : 'PROFESSIONAL EXPERIENCE', 60, currentY, { characterSpacing: 1.5 });
                    currentY += 25;
                    for (const job of data.candidateJobs) {
                        const descriptionHtml = job.jobReference.description || '';
                        const cleanForEstimate = descriptionHtml.replace(/<[^>]*>/g, '');
                        const dateHeight = 15;
                        const titleHeight = 20;
                        const descriptionHeight = cleanForEstimate
                            ? estimateTextHeight(cleanForEstimate, doc.page.width - 260, 10, 'Avenir-Book')
                            : 0;
                        const estimatedHeight = dateHeight + titleHeight + descriptionHeight + 30;
                        if (currentY + estimatedHeight > doc.page.height - 150) {
                            const sectionTitle = data.isFR
                                ? 'EXPÉRIENCE PROFESSIONNELLE (suite)'
                                : 'PROFESSIONAL EXPERIENCE (continued)';
                            currentY = startNewSectionPage(sectionTitle);
                        }
                        const dateText = job.startDate
                            ? `${job.startDate}${job.endDate
                                ? ` – ${job.endDate}`
                                : data.isFR
                                    ? ' – Présent'
                                    : ' – Present'}`
                            : '';
                        doc.font('Avenir-Heavy')
                            .fontSize(10)
                            .fillColor(primaryColor)
                            .text(dateText, 60, currentY, { width: 120 });
                        doc.font('Avenir-Heavy')
                            .fontSize(10)
                            .text(job.jobReference.jobTitle.toUpperCase(), 200, currentY, { width: doc.page.width - 260 });
                        currentY = doc.y + 5;
                        if (descriptionHtml.trim()) {
                            currentY = renderHtmlWithPageBreaks(descriptionHtml, 200, currentY, doc.page.width - 260, {
                                font: 'Avenir-Book',
                                fontSize: 10,
                                fillColor: primaryColor,
                                align: 'justify',
                            });
                            currentY += 20;
                        }
                        else {
                            currentY += 15;
                        }
                    }
                    currentSection = 'other';
                    if (data.candidateEducation.length > 0) {
                        currentSection = 'education';
                        doc.addPage();
                        lastKnownPage = doc.bufferedPageRange().count - 1;
                        drawHeader();
                        pagesCreated.push(pagesCreated.length);
                        currentY = 170;
                        doc.font('Metropolis-Regular')
                            .fontSize(13)
                            .fillColor(primaryColor)
                            .text(data.isFR ? 'FORMATION' : 'EDUCATION', 60, currentY, { characterSpacing: 1.5 });
                        currentY += 25;
                        for (const edu of data.candidateEducation) {
                            const descriptionHtml = edu.jobReference.description || '';
                            const cleanForEstimate = descriptionHtml.replace(/<[^>]*>/g, '');
                            const dateHeight = 15;
                            const titleHeight = 20;
                            const descriptionHeight = cleanForEstimate
                                ? estimateTextHeight(cleanForEstimate, doc.page.width - 260, 10, 'Avenir-Book')
                                : 0;
                            const estimatedHeight = dateHeight + titleHeight + descriptionHeight + 30;
                            if (currentY + estimatedHeight >
                                doc.page.height - 150) {
                                const sectionTitle = data.isFR
                                    ? 'FORMATION (suite)'
                                    : 'EDUCATION (continued)';
                                currentY = startNewSectionPage(sectionTitle);
                            }
                            const dateText = edu.startDate
                                ? `${edu.startDate}${edu.endDate
                                    ? ` – ${edu.endDate}`
                                    : data.isFR
                                        ? ' – Présent'
                                        : ' – Present'}`
                                : '';
                            doc.font('Avenir-Heavy')
                                .fontSize(10)
                                .fillColor(primaryColor)
                                .text(dateText, 60, currentY, { width: 120 });
                            doc.font('Avenir-Heavy')
                                .fontSize(10)
                                .text(edu.jobReference.jobTitle.toUpperCase(), 200, currentY, { width: doc.page.width - 260 });
                            currentY = doc.y + 5;
                            if (descriptionHtml.trim()) {
                                currentY = renderHtmlWithPageBreaks(descriptionHtml, 200, currentY, doc.page.width - 260, {
                                    font: 'Avenir-Book',
                                    fontSize: 10,
                                    fillColor: primaryColor,
                                    align: 'justify',
                                });
                                currentY += 20;
                            }
                            else {
                                currentY += 15;
                            }
                        }
                        currentSection = 'other';
                    }
                    const range = doc.bufferedPageRange();
                    for (let i = 0; i < range.count; i++) {
                        doc.switchToPage(i);
                        const currentPageY = doc.y;
                        const footerY = doc.page.height - 90;
                        const footerImageName = data.isFR
                            ? 'footer-fr.png'
                            : 'footer-en.png';
                        const footerImagePath = path.join(imagesPath, footerImageName);
                        if (fs.existsSync(footerImagePath)) {
                            doc.image(footerImagePath, 0, footerY, {
                                width: doc.page.width,
                                height: 90,
                            });
                        }
                        doc.y = currentPageY;
                    }
                    doc.end();
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }
    getJobTitleTranslation(currentJob, language) {
        if (!currentJob) {
            return '';
        }
        if (currentJob.translations && currentJob.translations.length > 0) {
            const translation = currentJob.translations.find((t) => t.entityField === 'label' &&
                t.languageId === this.getLanguageId(language));
            if (translation) {
                return translation.value;
            }
        }
        return currentJob.label || '';
    }
    getLanguageId(language) {
        return language === 'fr'
            ? '8fee8435-169a-4e74-b8f3-d613afcd644b'
            : '1757b675-a782-417b-9bd5-19ae925ee103';
    }
    formatDate(date, format = 'year', language = 'fr') {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (format === 'year') {
            return `${dateObj.getFullYear()}`;
        }
        else {
            const monthNames = {
                fr: [
                    'Jan',
                    'Fév',
                    'Mar',
                    'Avr',
                    'Mai',
                    'Jun',
                    'Jul',
                    'Aoû',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Déc',
                ],
                en: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ],
            };
            const monthName = monthNames[language][dateObj.getMonth()];
            return `${monthName} ${dateObj.getFullYear()}`;
        }
    }
    getCandidateLanguages(candidateLanguages, language) {
        if (!candidateLanguages || candidateLanguages.length === 0) {
            return [];
        }
        return candidateLanguages.map((candidateLanguage) => {
            const languageName = this.getLanguageName(candidateLanguage.languageCode, language);
            const level = this.getLanguageLevelTranslation(candidateLanguage.levelLanguage, language);
            return {
                languageName,
                level,
            };
        });
    }
    getLanguageName(languageCode, language) {
        var _a;
        const languageNames = {
            fr: { fr: 'Français', en: 'French' },
            en: { fr: 'Anglais', en: 'English' },
            es: { fr: 'Espagnol', en: 'Spanish' },
            de: { fr: 'Allemand', en: 'German' },
            it: { fr: 'Italien', en: 'Italian' },
            pt: { fr: 'Portugais', en: 'Portuguese' },
            ru: { fr: 'Russe', en: 'Russian' },
            zh: { fr: 'Chinois', en: 'Chinese' },
            ja: { fr: 'Japonais', en: 'Japanese' },
            ar: { fr: 'Arabe', en: 'Arabic' },
            nl: { fr: 'Néerlandais', en: 'Dutch' },
            sv: { fr: 'Suédois', en: 'Swedish' },
            no: { fr: 'Norvégien', en: 'Norwegian' },
            da: { fr: 'Danois', en: 'Danish' },
            fi: { fr: 'Finnois', en: 'Finnish' },
        };
        return (((_a = languageNames[languageCode]) === null || _a === void 0 ? void 0 : _a[language]) ||
            languageCode.toUpperCase());
    }
    getLanguageLevelTranslation(levelLanguage, language) {
        if (!levelLanguage) {
            return '';
        }
        if (levelLanguage.translations &&
            levelLanguage.translations.length > 0) {
            const translation = levelLanguage.translations.find((t) => t.entityField === 'label' &&
                t.languageId === this.getLanguageId(language));
            if (translation) {
                return translation.value;
            }
        }
        return levelLanguage.label || '';
    }
    normalizeJobDescription(text) {
        if (!text)
            return '';
        if (/<(?:p|h[1-6]|ul|ol|li|div|br)\b/i.test(text)) {
            return text;
        }
        return '<p>' + nextalys_js_helpers_1.MainHelpers.replaceAll(text, '\n', '<br/>') + '</p>';
    }
    resolveCandidatePicturePath(candidateId, profilePictureFile) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(profilePictureFile === null || profilePictureFile === void 0 ? void 0 : profilePictureFile.file)) {
                console.log(`Candidate ${candidateId}: No profile picture file object found`);
                return null;
            }
            console.log('profilePictureFile', profilePictureFile);
            const fileObject = profilePictureFile.file;
            console.log(`Candidate ${candidateId}: Resolving picture - physicalName:`, fileObject.physicalName, 'externalFilePath:', fileObject.externalFilePath);
            if (fileObject.physicalName) {
                const privateLocalPath = path.join(environment_1.Environment.CandidatesDirectory, candidateId, fileObject.physicalName);
                if (fs.existsSync(privateLocalPath)) {
                    console.log(`Candidate ${candidateId}: Found picture in private directory: ${privateLocalPath}`);
                    return privateLocalPath;
                }
                const publicLocalPath = path.join(environment_1.Environment.CandidatesPublicDirectory, candidateId, fileObject.physicalName);
                if (fs.existsSync(publicLocalPath)) {
                    console.log(`Candidate ${candidateId}: Found picture in public directory: ${publicLocalPath}`);
                    return publicLocalPath;
                }
                console.warn(`Candidate ${candidateId}: physicalName exists but file not found in local storage (tried private and public directories):`, fileObject.physicalName);
            }
            if (fileObject.externalFilePath) {
                try {
                    console.log(`Candidate ${candidateId}: Attempting to download from GCS:`, fileObject.externalFilePath);
                    let ext = 'jpg';
                    if (fileObject.mimeType) {
                        const mimeMap = {
                            'image/jpeg': 'jpg',
                            'image/jpg': 'jpg',
                            'image/png': 'png',
                            'image/gif': 'gif',
                            'image/webp': 'webp',
                        };
                        ext = mimeMap[fileObject.mimeType] || 'jpg';
                    }
                    const tempFilePath = path.join(environment_1.Environment.UploadedFilesTempDirectory, `candidate-${candidateId}-picture-${nextalys_js_helpers_1.MainHelpers.generateGuid()}.${ext}`);
                    const downloadResponse = yield this.gCloudStorageService.downloadFile(fileObject.externalFilePath, tempFilePath);
                    if (downloadResponse.success && fs.existsSync(tempFilePath)) {
                        console.log(`Candidate ${candidateId}: Successfully downloaded picture from GCS to: ${tempFilePath}`);
                        return tempFilePath;
                    }
                    else {
                        console.error(`Candidate ${candidateId}: Failed to download picture from GCS:`, 'externalFilePath:', fileObject.externalFilePath, 'success:', downloadResponse.success, 'error:', downloadResponse.error || 'No error details');
                    }
                }
                catch (error) {
                    console.error(`Candidate ${candidateId}: Exception while downloading picture from GCS:`, error);
                }
            }
            console.warn(`Candidate ${candidateId}: No valid picture found in any storage location`);
            return null;
        });
    }
};
CandidateResumeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(candidate_entity_1.Candidate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        gcloud_storage_service_1.GCloudStorageService])
], CandidateResumeService);
exports.CandidateResumeService = CandidateResumeService;
//# sourceMappingURL=candidate-resume.service.js.map