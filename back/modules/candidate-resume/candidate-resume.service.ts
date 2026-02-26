import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { DateHelpers, MainHelpers } from 'nextalys-js-helpers';
import { FileHelpers } from 'nextalys-node-helpers';
import * as path from 'path';
import * as PDFDocument from 'pdfkit';
import { Repository } from 'typeorm';
import { ImagesHelper } from '../../../shared/images.helper';
import { getNationality } from '../../../shared/nationality-helper';
import { PersonGender } from '../../../shared/shared-constants';
import { resumesCandidatePdfFolder } from '../../environment/constants';
import { Environment } from '../../environment/environment';
import { Candidate } from '../candidates/candidate.entity';
import { GCloudStorageService } from '../gdrive/gcloud-storage-service';

type PdfJobReference = {
    jobTitle: string;
    companyName: string;
    location: string;
    description: string;
};

type PdfJobOrEducationEntry = {
    startDate: string;
    endDate: string;
    jobReference: PdfJobReference;
};

type PdfData = {
    isFR: boolean;
    firstName: string;
    showAge: boolean;
    showNationality: boolean;
    age: number;
    nationality: string;
    city: string;
    state: string;
    country: string;
    displayCountry: string;
    showState: boolean;
    candidatePresentation: string;
    hasPicture: boolean;
    candidatePictureUrl: string;
    hasLanguage: boolean;
    languages: Array<{ languageName: string; level: string }>;
    jobTitle: string;
    references: string[];
    hasReferences: boolean;
    candidateJobs: PdfJobOrEducationEntry[];
    candidateEducation: PdfJobOrEducationEntry[];
};

@Injectable()
export class CandidateResumeService {
    constructor(
        @InjectRepository(Candidate)
        private readonly candidateRepository: Repository<Candidate>,
        private readonly gCloudStorageService: GCloudStorageService,
    ) {}

    public async generateCandidateResume(
        candidateId: string,
        body: {
            language: 'fr' | 'en';
            showAge: boolean;
            showNationality: boolean;
            selectedJobId: string;
            selectedPresentationId?: string;
        },
    ) {
        const candidate = await this.candidateRepository
            .createQueryBuilder('candidate')
            .select([
                'candidate.id',
                'candidate.firstName',
                'candidate.birthDate',
                'candidate.nationality',
                'candidate.skills',
            ])
            // Gender
            .leftJoin('candidate.gender', 'gender')
            .addSelect(['gender.code'])
            // Addresses - only need city, department, country
            .leftJoin('candidate.addresses', 'addresses')
            .addSelect([
                'addresses.city',
                'addresses.department',
                'addresses.country',
            ])
            // Candidate Current Jobs
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
            // Candidate Languages
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
            // Candidate Jobs (for experience and education) - ordered by most recent first
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
            // Files - for profile picture
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
            // Presentations
            .leftJoin('candidate.presentations', 'presentations')
            .addSelect([
                'presentations.id',
                'presentations.title',
                'presentations.content',
                'presentations.isDefault',
            ])
            .where('candidate.id = :candidateId', { candidateId })
            .getOne();

        const imagePath = ImagesHelper.candidateProfilePicture(
            candidate as any,
        );

        const candidatePicture = ImagesHelper.getCandidatePicture(
            candidate as any,
        );

        const country = candidate.addresses[0]?.country?.trim() || '';
        const displayCountry = country === 'AE' ? 'UAE' : country;
        const references = candidate.candidateJobs
            .filter((candidateJob) => candidateJob.jobReference?.note)
            .map((candidateJob) => candidateJob.jobReference?.note);

        // Determine which presentation to use
        let presentationContent = candidate.skills || ''; // Fallback to legacy skills field
        if (candidate.presentations && candidate.presentations.length > 0) {
            if (body.selectedPresentationId) {
                // Use the specifically selected presentation
                const selectedPresentation = candidate.presentations.find(
                    (p) => p.id === body.selectedPresentationId,
                );
                if (selectedPresentation) {
                    presentationContent = selectedPresentation.content || '';
                }
            } else {
                // Use the default presentation
                const defaultPresentation = candidate.presentations.find(
                    (p) => p.isDefault,
                );
                if (defaultPresentation) {
                    presentationContent = defaultPresentation.content || '';
                } else {
                    // If no default, use the first one
                    presentationContent =
                        candidate.presentations[0]?.content || '';
                }
            }
        }

        // Truncate presentation content to 1500 characters max for CV MMI
        const maxPresentationLength = 1500;
        if (presentationContent.length > maxPresentationLength) {
            presentationContent =
                presentationContent.substring(0, maxPresentationLength - 3) +
                '...';
        }

        const pdfData: PdfData = {
            isFR: body.language === 'fr',
            firstName: candidate.firstName,
            showAge: body.showAge,
            showNationality: body.showNationality,
            age: DateHelpers.getAge(new Date(candidate.birthDate)),
            nationality: getNationality(
                candidate.nationality || candidate.addresses[0]?.country,
                body.language,
                candidate.gender?.code === PersonGender.Male ? 'm' : 'f',
            ),
            city: candidate.addresses[0]?.city?.trim() || '',
            state: candidate.addresses[0]?.department?.trim() || '',
            country,
            displayCountry,
            showState: country === 'US',
            candidatePresentation: presentationContent,
            hasPicture: imagePath?.file?.physicalName ? true : false,
            candidatePictureUrl: candidatePicture,
            hasLanguage: candidate.candidateLanguages.length > 0,
            languages: this.getCandidateLanguages(
                candidate.candidateLanguages,
                body.language,
            ),
            jobTitle: this.getJobTitleTranslation(
                candidate.candidateCurrentJobs.find(
                    (x) => x.currentJob.id === body.selectedJobId,
                )?.currentJob,
                body.language,
            ),
            references,
            hasReferences: references.length > 0,
            candidateJobs: candidate.candidateJobs
                .filter(
                    (candidateJob) =>
                        candidateJob.jobReference &&
                        candidateJob.type === 'JOB',
                )
                .map((candidateJob) => ({
                    startDate: candidateJob.experienceStartDate
                        ? this.formatDate(
                              candidateJob.experienceStartDate,
                              candidateJob.showMonthInResume
                                  ? 'year-month'
                                  : 'year',
                              body.language,
                          )
                        : '',
                    endDate: candidateJob.experienceEndDate
                        ? this.formatDate(
                              candidateJob.experienceEndDate,
                              candidateJob.showMonthInResume
                                  ? 'year-month'
                                  : 'year',
                              body.language,
                          )
                        : '',
                    jobReference: {
                        jobTitle:
                            candidateJob.jobName ||
                            this.getJobTitleTranslation(
                                candidateJob.job,
                                body.language,
                            ),
                        companyName:
                            candidateJob.jobReference.companyName || '',
                        location:
                            candidateJob.jobReference.addresses?.[0]?.city ||
                            '',
                        description: this.normalizeJobDescription(
                            candidateJob.jobDescription || '',
                        ),
                    },
                })),
            candidateEducation: candidate.candidateJobs
                .filter(
                    (candidateJob) =>
                        candidateJob.jobReference &&
                        candidateJob.type === 'EDUCATION',
                )
                .map((candidateJob) => ({
                    startDate: candidateJob.experienceStartDate
                        ? this.formatDate(
                              candidateJob.experienceStartDate,
                              candidateJob.showMonthInResume
                                  ? 'year-month'
                                  : 'year',
                              body.language,
                          )
                        : '',
                    endDate: candidateJob.experienceEndDate
                        ? this.formatDate(
                              candidateJob.experienceEndDate,
                              candidateJob.showMonthInResume
                                  ? 'year-month'
                                  : 'year',
                              body.language,
                          )
                        : '',
                    jobReference: {
                        jobTitle:
                            candidateJob.jobName ||
                            this.getJobTitleTranslation(
                                candidateJob.job,
                                body.language,
                            ),
                        companyName:
                            candidateJob.jobReference.companyName || '',
                        location:
                            candidateJob.jobReference.addresses?.[0]?.city ||
                            '',
                        description: this.normalizeJobDescription(
                            candidateJob.jobDescription || '',
                        ),
                    },
                })),
        };

        // Generate PDF using PDFKit
        const pdfBuffer = await this.generatePdfWithPDFKit(pdfData, candidate);

        // Save PDF to disk
        const outputFolder = path.join(
            Environment.PdfPrivateOutputFolder,
            resumesCandidatePdfFolder,
        );
        if (!(await FileHelpers.fileExists(outputFolder))) {
            await FileHelpers.createDirectory(outputFolder);
        }
        const outputPath = path.join(outputFolder, candidate.id + '.pdf');
        await FileHelpers.writeFile(outputPath, pdfBuffer);

        return {
            buffer: pdfBuffer,
            fileName: `${candidate.firstName}_resume.pdf`,
            mimeType: 'application/pdf',
        };
    }

    private async generatePdfWithPDFKit(
        data: PdfData,
        candidate: any,
    ): Promise<Buffer> {
        // Pre-resolve the candidate picture path before starting PDF generation
        let candidatePicturePath: string | null = null;
        if (data.hasPicture) {
            const profilePictureFile =
                ImagesHelper.candidateProfilePicture(candidate);
            candidatePicturePath = await this.resolveCandidatePicturePath(
                candidate.id,
                profilePictureFile,
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: 'A4',
                    margins: { top: 30, bottom: 90, left: 60, right: 60 }, // Increased bottom margin for footer
                    bufferPages: true,
                });

                const chunks: Buffer[] = [];
                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);

                // Track pages for footer drawing
                const pagesCreated: number[] = [];

                // Track current section for auto-page handling
                let currentSection: 'experience' | 'education' | 'other' =
                    'other';
                let lastKnownPage = 0;

                // Define fonts paths
                const htmlTemplatesPath = path.join(
                    Environment.ApiBasePath,
                    Environment.HtmlTemplatesFolderName,
                );
                const fontsPath = path.join(htmlTemplatesPath, 'fonts');
                const imagesPath = path.join(htmlTemplatesPath, 'images');

                // Register custom fonts for PDFKit
                doc.registerFont(
                    'Bodoni-Bold',
                    path.join(fontsPath, 'BodoniFerraraOrigin-Bold.otf'),
                );
                doc.registerFont(
                    'Bodoni-Regular',
                    path.join(fontsPath, 'BodoniFerraraOrigin-Regular.otf'),
                );
                doc.registerFont(
                    'Metropolis-Bold',
                    path.join(fontsPath, 'Metropolis-Bold.otf'),
                );
                doc.registerFont(
                    'Metropolis-Medium',
                    path.join(fontsPath, 'Metropolis-Medium.otf'),
                );
                doc.registerFont(
                    'Metropolis-Regular',
                    path.join(fontsPath, 'Metropolis-Regular.otf'),
                );
                doc.registerFont(
                    'Avenir-Heavy',
                    path.join(fontsPath, 'Avenir Heavy.ttf'),
                );
                doc.registerFont(
                    'Avenir-Book',
                    path.join(fontsPath, 'Avenir Book.ttf'),
                );

                // Define colors
                const primaryColor = '#131e48';
                const backgroundColor = '#faf8f3';
                const accentColor = '#e8dec6';

                // Helper function to draw header
                const drawHeader = (yPosition = 0) => {
                    const savedY = doc.y;

                    doc.rect(0, yPosition, doc.page.width, 90).fill('#0b153b');

                    doc.font('Metropolis-Medium')
                        .fontSize(8)
                        .fillColor('white')
                        .text(
                            data.isFR
                                ? 'MEILLEURS CANDIDATS POUR LE POSTE DE'
                                : 'TOP CV CANDIDATES FOR',
                            60,
                            yPosition + 35,
                            { width: 350, lineBreak: false },
                        );

                    doc.font('Bodoni-Bold')
                        .fontSize(18)
                        .text(data.jobTitle, 60, yPosition + 50, {
                            width: 350,
                            lineBreak: false,
                        });

                    doc.font('Metropolis-Medium')
                        .fontSize(7)
                        .text(
                            data.isFR ? 'PRÉSENTÉ PAR' : 'PRESENTED BY',
                            doc.page.width - 180,
                            yPosition + 35,
                            { width: 120, align: 'right', lineBreak: false },
                        );

                    doc.font('Bodoni-Bold')
                        .fontSize(18)
                        .text(
                            'Morgan & Mallet',
                            doc.page.width - 180,
                            yPosition + 50,
                            { width: 120, align: 'right', lineBreak: false },
                        );

                    doc.y = savedY;
                };

                // Helper function to estimate text height
                const estimateTextHeight = (
                    text: string,
                    width: number,
                    fontSize: number = 10,
                    font: string = 'Avenir-Book',
                ): number => {
                    // Temporarily set font and size to measure
                    doc.font(font).fontSize(fontSize);
                    const height = doc.heightOfString(text, {
                        width: width,
                        align: 'justify',
                    });
                    // Note: Font state will be reset when actually rendering
                    return height;
                };

                // Helper function to start new page with section header
                const startNewSectionPage = (sectionTitle: string) => {
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

                    return 195; // Y position after section title
                };

                // Helper function to render long text with manual page breaks
                const renderTextWithPageBreaks = (
                    text: string,
                    x: number,
                    y: number,
                    width: number,
                    options: any = {},
                ) => {
                    const pageBottomMargin = 150; // Space to reserve for footer
                    const maxHeight = doc.page.height - pageBottomMargin;

                    let currentY = y;
                    const lines = text.split('\n');

                    for (const line of lines) {
                        if (!line.trim()) {
                            // Empty line, add small gap
                            currentY += 12;
                            continue;
                        }

                        // Measure the height this line would take
                        const testY = doc.y;
                        doc.y = currentY;
                        const heightOfLine = doc.heightOfString(line, {
                            width: width,
                            ...options,
                        });
                        doc.y = testY; // Reset Y

                        // Check if we need a new page
                        if (currentY + heightOfLine > maxHeight) {
                            // Create new page with header
                            let sectionTitle = '';
                            if (currentSection === 'experience') {
                                sectionTitle = data.isFR
                                    ? 'EXPÉRIENCE PROFESSIONNELLE (suite)'
                                    : 'PROFESSIONAL EXPERIENCE (continued)';
                            } else if (currentSection === 'education') {
                                sectionTitle = data.isFR
                                    ? 'FORMATION (suite)'
                                    : 'EDUCATION (continued)';
                            }

                            currentY = startNewSectionPage(sectionTitle);
                        }

                        // Render the line
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

                // Helper: Parse HTML into block-level elements
                const parseHtmlBlocks = (
                    html: string,
                ): Array<{ tag: string; content: string }> => {
                    const blocks: Array<{ tag: string; content: string }> = [];
                    const blockRegex =
                        /<(p|h[1-3]|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>|<(br)\s*\/?>/gi;
                    let match;
                    while ((match = blockRegex.exec(html)) !== null) {
                        const tag = (match[1] || match[3]).toLowerCase();
                        const content = match[2] || '';
                        if (tag === 'ul' || tag === 'ol') {
                            // Push container marker for list type tracking
                            blocks.push({ tag, content: '' });
                            // Extract <li> children from inside the list
                            const liRegex =
                                /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
                            let liMatch;
                            while (
                                (liMatch = liRegex.exec(content)) !== null
                            ) {
                                blocks.push({
                                    tag: 'li',
                                    content: liMatch[1],
                                });
                            }
                        } else {
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

                // Helper: Parse inline formatting within a block
                const parseInlineFormatting = (
                    html: string,
                ): Array<{ text: string; bold: boolean }> => {
                    const segments: Array<{ text: string; bold: boolean }> = [];
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

                // Helper: Render HTML content with page breaks for PDFKit
                const renderHtmlWithPageBreaks = (
                    html: string,
                    x: number,
                    y: number,
                    width: number,
                    baseOptions: any = {},
                ) => {
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
                                } else {
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
                        const fullText =
                            prefix + segments.map((s) => s.text).join('');
                        if (!fullText.trim()) {
                            currentY += 8;
                            continue;
                        }

                        const estimatedHeight = doc.heightOfString(fullText, {
                            width: width - indent,
                        } as any);

                        if (currentY + estimatedHeight > maxHeight) {
                            let sectionTitle = '';
                            if (currentSection === 'experience') {
                                sectionTitle = data.isFR
                                    ? 'EXPÉRIENCE PROFESSIONNELLE (suite)'
                                    : 'PROFESSIONAL EXPERIENCE (continued)';
                            } else if (currentSection === 'education') {
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
                                .text(
                                    seg.text,
                                    i === 0 ? textX : undefined,
                                    i === 0 ? currentY : undefined,
                                    {
                                        width: width - indent,
                                        align: baseOptions.align || 'left',
                                        continued: !isLast,
                                    },
                                );
                        }

                        currentY =
                            doc.y + (block.tag === 'li' ? 4 : 8);
                    }

                    return currentY;
                };

                // PAGE 1: Header and candidate info
                drawHeader();
                pagesCreated.push(0); // Track page 0
                lastKnownPage = 0;

                // Candidate info section with background
                let currentY = 90;
                doc.rect(0, currentY, doc.page.width, 140).fill(
                    backgroundColor,
                );

                // Candidate name and location
                doc.font('Avenir-Heavy')
                    .fontSize(18)
                    .fillColor(primaryColor)
                    .text(data.firstName.toUpperCase(), 60, currentY + 25, {
                        characterSpacing: 2,
                    });

                // Location
                currentY += 50;
                let locationText = '';
                if (data.city) {
                    locationText = data.city;
                    if (data.showState) locationText += `, ${data.state}`;
                    locationText += `, ${data.displayCountry}`;
                } else if (data.showState) {
                    locationText = `${data.state}, ${data.displayCountry}`;
                } else {
                    locationText = data.displayCountry;
                }
                doc.font('Avenir-Heavy')
                    .fontSize(10)
                    .text(locationText, 60, currentY);

                // Age and nationality
                currentY += 10;
                let personalInfo = '';
                if (data.showNationality) {
                    personalInfo += data.nationality;
                }
                if (data.showAge) {
                    if (personalInfo) personalInfo += ', ';
                    personalInfo += data.isFR
                        ? `${data.age} ans`
                        : `${data.age} years old`;
                }
                if (personalInfo) {
                    doc.text(personalInfo, 60, currentY);
                    currentY += 10;
                }

                // Languages
                if (data.hasLanguage) {
                    const languagesText =
                        (data.isFR ? 'Langues : ' : 'Languages : ') +
                        data.languages
                            .map(
                                (l: { languageName: string; level: string }) =>
                                    `${l.languageName} - ${l.level}`,
                            )
                            .join(', ');
                    doc.text(languagesText, 60, currentY, { width: 350 });
                }

                // Profile picture (already resolved before PDF generation)
                if (
                    candidatePicturePath &&
                    fs.existsSync(candidatePicturePath)
                ) {
                    try {
                        doc.image(
                            candidatePicturePath,
                            doc.page.width - 170,
                            105,
                            {
                                width: 110,
                                height: 110,
                            },
                        );
                    } catch (e) {
                        console.error(
                            'Error adding candidate picture to PDF:',
                            e,
                        );
                    }
                }

                // Presentation section
                currentY = 280;
                doc.font('Metropolis-Regular')
                    .fontSize(13)
                    .fillColor(primaryColor)
                    .text(
                        data.isFR ? 'PRÉSENTATION' : 'PRESENTATION',
                        60,
                        currentY,
                        { characterSpacing: 1.5 },
                    );

                currentY += 25;
                doc.font('Avenir-Book')
                    .fontSize(10)
                    .text(data.candidatePresentation || '', 60, currentY, {
                        width: doc.page.width - 120,
                        align: 'justify',
                        // lineGap: 3,
                    });

                currentY = doc.y + 40;

                // References section
                doc.font('Metropolis-Regular')
                    .fontSize(13)
                    .fillColor(primaryColor)
                    .text(
                        data.isFR ? 'RÉFÉRENCES' : 'REFERENCES',
                        60,
                        currentY,
                        {
                            characterSpacing: 1.5,
                        },
                    );

                currentY += 25;
                if (data.hasReferences) {
                    data.references.forEach((ref: string, index: number) => {
                        doc.font('Avenir-Book')
                            .fontSize(10)
                            .text(ref, 60, currentY, {
                                width: doc.page.width - 120,
                                align: 'justify',
                                lineGap: -1,
                            });
                        currentY = doc.y + 15;
                    });
                } else {
                    doc.font('Avenir-Book')
                        .fontSize(10)
                        .text(
                            data.isFR
                                ? 'Références disponibles sur demande'
                                : 'References available on request',
                            60,
                            currentY,
                            { width: doc.page.width - 120 },
                        );
                }

                // PAGE 2: Professional Experience
                currentSection = 'experience';
                doc.addPage();
                lastKnownPage = doc.bufferedPageRange().count - 1;
                drawHeader();
                pagesCreated.push(pagesCreated.length); // Track new page

                currentY = 170;
                doc.font('Metropolis-Regular')
                    .fontSize(13)
                    .fillColor(primaryColor)
                    .text(
                        data.isFR
                            ? 'EXPÉRIENCE PROFESSIONNELLE'
                            : 'PROFESSIONAL EXPERIENCE',
                        60,
                        currentY,
                        { characterSpacing: 1.5 },
                    );

                currentY += 25;

                for (const job of data.candidateJobs) {
                    // Estimate space needed for this job entry
                    const descriptionHtml =
                        job.jobReference.description || '';
                    const cleanForEstimate = descriptionHtml.replace(
                        /<[^>]*>/g,
                        '',
                    );
                    const dateHeight = 15;
                    const titleHeight = 20;
                    const descriptionHeight = cleanForEstimate
                        ? estimateTextHeight(
                              cleanForEstimate,
                              doc.page.width - 260,
                              10,
                              'Avenir-Book',
                          )
                        : 0;
                    const estimatedHeight =
                        dateHeight + titleHeight + descriptionHeight + 30;

                    // Check if entire entry fits on current page
                    if (currentY + estimatedHeight > doc.page.height - 150) {
                        const sectionTitle = data.isFR
                            ? 'EXPÉRIENCE PROFESSIONNELLE (suite)'
                            : 'PROFESSIONAL EXPERIENCE (continued)';
                        currentY = startNewSectionPage(sectionTitle);
                    }

                    // Date range
                    const dateText = job.startDate
                        ? `${job.startDate}${
                              job.endDate
                                  ? ` – ${job.endDate}`
                                  : data.isFR
                                  ? ' – Présent'
                                  : ' – Present'
                          }`
                        : '';

                    doc.font('Avenir-Heavy')
                        .fontSize(10)
                        .fillColor(primaryColor)
                        .text(dateText, 60, currentY, { width: 120 });

                    // Job title
                    doc.font('Avenir-Heavy')
                        .fontSize(10)
                        .text(
                            job.jobReference.jobTitle.toUpperCase(),
                            200,
                            currentY,
                            { width: doc.page.width - 260 },
                        );

                    currentY = doc.y + 5;

                    // Job description (HTML-aware rendering)
                    if (descriptionHtml.trim()) {
                        currentY = renderHtmlWithPageBreaks(
                            descriptionHtml,
                            200,
                            currentY,
                            doc.page.width - 260,
                            {
                                font: 'Avenir-Book',
                                fontSize: 10,
                                fillColor: primaryColor,
                                align: 'justify',
                            },
                        );

                        currentY += 20;
                    } else {
                        currentY += 15;
                    }
                }

                // Reset section tracking after experience
                currentSection = 'other';

                // PAGE 3: Education (if any)
                if (data.candidateEducation.length > 0) {
                    currentSection = 'education';
                    doc.addPage();
                    lastKnownPage = doc.bufferedPageRange().count - 1;
                    drawHeader();
                    pagesCreated.push(pagesCreated.length); // Track new page

                    currentY = 170;
                    doc.font('Metropolis-Regular')
                        .fontSize(13)
                        .fillColor(primaryColor)
                        .text(
                            data.isFR ? 'FORMATION' : 'EDUCATION',
                            60,
                            currentY,
                            { characterSpacing: 1.5 },
                        );

                    currentY += 25;

                    for (const edu of data.candidateEducation) {
                        // Estimate space needed for this education entry
                        const descriptionHtml =
                            edu.jobReference.description || '';
                        const cleanForEstimate = descriptionHtml.replace(
                            /<[^>]*>/g,
                            '',
                        );
                        const dateHeight = 15;
                        const titleHeight = 20;
                        const descriptionHeight = cleanForEstimate
                            ? estimateTextHeight(
                                  cleanForEstimate,
                                  doc.page.width - 260,
                                  10,
                                  'Avenir-Book',
                              )
                            : 0;
                        const estimatedHeight =
                            dateHeight + titleHeight + descriptionHeight + 30;

                        // Check if entire entry fits on current page
                        if (
                            currentY + estimatedHeight >
                            doc.page.height - 150
                        ) {
                            const sectionTitle = data.isFR
                                ? 'FORMATION (suite)'
                                : 'EDUCATION (continued)';
                            currentY = startNewSectionPage(sectionTitle);
                        }

                        // Date range
                        const dateText = edu.startDate
                            ? `${edu.startDate}${
                                  edu.endDate
                                      ? ` – ${edu.endDate}`
                                      : data.isFR
                                      ? ' – Présent'
                                      : ' – Present'
                              }`
                            : '';

                        doc.font('Avenir-Heavy')
                            .fontSize(10)
                            .fillColor(primaryColor)
                            .text(dateText, 60, currentY, { width: 120 });

                        // Education title
                        doc.font('Avenir-Heavy')
                            .fontSize(10)
                            .text(
                                edu.jobReference.jobTitle.toUpperCase(),
                                200,
                                currentY,
                                { width: doc.page.width - 260 },
                            );

                        currentY = doc.y + 5;

                        // Education description (HTML-aware rendering)
                        if (descriptionHtml.trim()) {
                            currentY = renderHtmlWithPageBreaks(
                                descriptionHtml,
                                200,
                                currentY,
                                doc.page.width - 260,
                                {
                                    font: 'Avenir-Book',
                                    fontSize: 10,
                                    fillColor: primaryColor,
                                    align: 'justify',
                                },
                            );

                            currentY += 20;
                        } else {
                            currentY += 15;
                        }
                    }

                    // Reset section tracking
                    currentSection = 'other';
                }

                // Now draw footers on all pages using switchToPage
                const range = doc.bufferedPageRange();
                for (let i = 0; i < range.count; i++) {
                    doc.switchToPage(i);
                    const currentPageY = doc.y; // Save current Y before footer

                    const footerY = doc.page.height - 90;

                    // Draw complete footer image (includes background, badge, text, QR code)
                    const footerImageName = data.isFR
                        ? 'footer-fr.png'
                        : 'footer-en.png';
                    const footerImagePath = path.join(
                        imagesPath,
                        footerImageName,
                    );

                    if (fs.existsSync(footerImagePath)) {
                        // Footer image should span full page width and be 90px tall
                        doc.image(footerImagePath, 0, footerY, {
                            width: doc.page.width,
                            height: 90,
                        });
                    }

                    // Restore Y position after ALL drawing
                    doc.y = currentPageY;
                }

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    private getJobTitleTranslation(
        currentJob: any,
        language: 'fr' | 'en',
    ): string {
        if (!currentJob) {
            return '';
        }

        // If translations exist, find the one for the current language
        if (currentJob.translations && currentJob.translations.length > 0) {
            const translation = currentJob.translations.find(
                (t: any) =>
                    t.entityField === 'label' &&
                    t.languageId === this.getLanguageId(language),
            );
            if (translation) {
                return translation.value;
            }
        }

        // Fallback to the default label
        return currentJob.label || '';
    }

    private getLanguageId(language: 'fr' | 'en'): string {
        // These are the language IDs from your data structure
        return language === 'fr'
            ? '8fee8435-169a-4e74-b8f3-d613afcd644b'
            : '1757b675-a782-417b-9bd5-19ae925ee103';
    }

    private formatDate(
        date: Date | string,
        format: 'year' | 'year-month' = 'year',
        language: 'fr' | 'en' = 'fr',
    ): string {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (format === 'year') {
            return `${dateObj.getFullYear()}`;
        } else {
            // Year + Month format
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

    private getCandidateLanguages(
        candidateLanguages: any[],
        language: 'fr' | 'en',
    ): Array<{ languageName: string; level: string }> {
        if (!candidateLanguages || candidateLanguages.length === 0) {
            return [];
        }

        return candidateLanguages.map((candidateLanguage) => {
            const languageName = this.getLanguageName(
                candidateLanguage.languageCode,
                language,
            );
            const level = this.getLanguageLevelTranslation(
                candidateLanguage.levelLanguage,
                language,
            );

            return {
                languageName,
                level,
            };
        });
    }

    private getLanguageName(
        languageCode: string,
        language: 'fr' | 'en',
    ): string {
        // Map language codes to their display names
        const languageNames: { [key: string]: { fr: string; en: string } } = {
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

        return (
            languageNames[languageCode]?.[language] ||
            languageCode.toUpperCase()
        );
    }

    private getLanguageLevelTranslation(
        levelLanguage: any,
        language: 'fr' | 'en',
    ): string {
        if (!levelLanguage) {
            return '';
        }

        // If translations exist, find the one for the current language
        if (
            levelLanguage.translations &&
            levelLanguage.translations.length > 0
        ) {
            const translation = levelLanguage.translations.find(
                (t: any) =>
                    t.entityField === 'label' &&
                    t.languageId === this.getLanguageId(language),
            );
            if (translation) {
                return translation.value;
            }
        }

        // Fallback to the default label
        return levelLanguage.label || '';
    }

    private normalizeJobDescription(text: string): string {
        if (!text) return '';
        // If content contains proper HTML block tags, pass through as-is
        if (/<(?:p|h[1-6]|ul|ol|li|div|br)\b/i.test(text)) {
            return text;
        }
        // Legacy plain text: convert \n to <br/> and wrap in <p>
        return '<p>' + MainHelpers.replaceAll(text, '\n', '<br/>') + '</p>';
    }

    /**
     * Resolves the candidate picture path from either local storage or Google Cloud Storage.
     * This handles the hybrid storage system where files can be in either location.
     *
     * Priority order:
     * 1. Check local private directory (back/uploads/private/candidates/[id]/[physicalName])
     * 2. Check local public directory (back/uploads/public/candidates/[id]/[physicalName])
     * 3. Download from Google Cloud Storage if externalFilePath exists
     *
     * @param candidateId The candidate ID
     * @param profilePictureFile The profile picture file object with physicalName and/or externalFilePath
     * @returns The local file path to use (downloads from GCS to temp if needed), or null if no picture available
     */
    private async resolveCandidatePicturePath(
        candidateId: string,
        profilePictureFile: any,
    ): Promise<string | null> {
        if (!profilePictureFile?.file) {
            console.log(
                `Candidate ${candidateId}: No profile picture file object found`,
            );
            return null;
        }

        console.log('profilePictureFile', profilePictureFile);

        const fileObject = profilePictureFile.file;
        console.log(
            `Candidate ${candidateId}: Resolving picture - physicalName:`,
            fileObject.physicalName,
            'externalFilePath:',
            fileObject.externalFilePath,
        );

        // Case 1: Try local storage with physicalName
        if (fileObject.physicalName) {
            // Try private directory first
            const privateLocalPath = path.join(
                Environment.CandidatesDirectory,
                candidateId,
                fileObject.physicalName,
            );

            if (fs.existsSync(privateLocalPath)) {
                console.log(
                    `Candidate ${candidateId}: Found picture in private directory: ${privateLocalPath}`,
                );
                return privateLocalPath;
            }

            // Try public directory as fallback
            const publicLocalPath = path.join(
                Environment.CandidatesPublicDirectory,
                candidateId,
                fileObject.physicalName,
            );

            if (fs.existsSync(publicLocalPath)) {
                console.log(
                    `Candidate ${candidateId}: Found picture in public directory: ${publicLocalPath}`,
                );
                return publicLocalPath;
            }

            console.warn(
                `Candidate ${candidateId}: physicalName exists but file not found in local storage (tried private and public directories):`,
                fileObject.physicalName,
            );
        }

        // Case 2: Try Google Cloud Storage with externalFilePath
        if (fileObject.externalFilePath) {
            try {
                console.log(
                    `Candidate ${candidateId}: Attempting to download from GCS:`,
                    fileObject.externalFilePath,
                );

                // Determine file extension from mime type or default to jpg
                let ext = 'jpg';
                if (fileObject.mimeType) {
                    const mimeMap: { [key: string]: string } = {
                        'image/jpeg': 'jpg',
                        'image/jpg': 'jpg',
                        'image/png': 'png',
                        'image/gif': 'gif',
                        'image/webp': 'webp',
                    };
                    ext = mimeMap[fileObject.mimeType] || 'jpg';
                }

                // Download to temp directory
                const tempFilePath = path.join(
                    Environment.UploadedFilesTempDirectory,
                    `candidate-${candidateId}-picture-${MainHelpers.generateGuid()}.${ext}`,
                );

                const downloadResponse =
                    await this.gCloudStorageService.downloadFile(
                        fileObject.externalFilePath,
                        tempFilePath,
                    );

                if (downloadResponse.success && fs.existsSync(tempFilePath)) {
                    console.log(
                        `Candidate ${candidateId}: Successfully downloaded picture from GCS to: ${tempFilePath}`,
                    );
                    return tempFilePath;
                } else {
                    console.error(
                        `Candidate ${candidateId}: Failed to download picture from GCS:`,
                        'externalFilePath:',
                        fileObject.externalFilePath,
                        'success:',
                        downloadResponse.success,
                        'error:',
                        downloadResponse.error || 'No error details',
                    );
                }
            } catch (error) {
                console.error(
                    `Candidate ${candidateId}: Exception while downloading picture from GCS:`,
                    error,
                );
            }
        }

        // No valid picture path found
        console.warn(
            `Candidate ${candidateId}: No valid picture found in any storage location`,
        );
        return null;
    }
}
