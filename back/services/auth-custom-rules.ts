import { JwtPayload } from '../../shared/jwt-payload';
import { CandidateFileType, RolesList } from '../../shared/shared-constants';
import { AppErrorWithMessage } from '../models/app-error';
import { UserDto } from '../models/dto/user-dto';

export function AuthCustomRules(user: UserDto) {
    //Write here custom auth rules
    const ok = !!user;
    if (!ok) {
        throw new AppErrorWithMessage('Custom error', 403);
    }
}
export const UserRelationsForLogin: string[] = [
    'image',
    'roles',
    'candidate',
    'candidate.files',
    'candidate.files.file',
    'candidate.files.fileType',
];

export const userFieldsForLogin: string[] = ['userName', 'mail'];

export const userRolesRules: {
    roleToAdd: RolesList;
    allowedRoles: string[];
}[] = [
    {
        roleToAdd: RolesList.AdminTech,
        allowedRoles: [RolesList.AdminTech],
    },
    {
        roleToAdd: RolesList.Admin,
        allowedRoles: [RolesList.Admin, RolesList.AdminTech],
    },
    {
        roleToAdd: RolesList.Consultant,
        allowedRoles: [
            RolesList.Consultant,
            RolesList.RH,
            RolesList.Admin,
            RolesList.AdminTech,
        ],
    },
    {
        roleToAdd: RolesList.Candidate,
        allowedRoles: [
            RolesList.Candidate,
            RolesList.RH,
            RolesList.Consultant,
            RolesList.Admin,
            RolesList.AdminTech,
        ],
    },
    {
        roleToAdd: RolesList.RH,
        allowedRoles: [RolesList.RH, RolesList.Admin, RolesList.AdminTech],
    },
    {
        roleToAdd: RolesList.Newsletter,
        allowedRoles: [
            RolesList.Newsletter,
            RolesList.Admin,
            RolesList.AdminTech,
        ],
    },
];

export const additionalUserFieldsForTokenPayloadFunction = (
    payload: JwtPayload,
    user: UserDto,
) => {
    //Add custom fields to payload
    if (user.candidate?.files?.length) {
        const mainPhotoFile = user.candidate.files.find(
            (x) =>
                x.fileType && x.fileType.code === CandidateFileType.MainPhoto,
        )?.file;
        if (mainPhotoFile) {
            payload.imageName = mainPhotoFile.name || null;
            payload.imagePhysicalName = mainPhotoFile.physicalName || null;
        }
    }
};
