import { UserRole } from '../../models/base';

const companyMailDomain = 'sportzfan.com';
const defaultPassword = 'admin';

const defaultAdmins = [
  {
    email: 'admin',
    firstName: 'Admin',
    lastName: 'Admin',
  },
];

export function generateAccount(
  teamId: string,
  tokenId: string,
  email: string,
  firstName: string,
  lastName: string,
  role: UserRole,
  isVerified = false,
) {
  return {
    teamId: teamId,
    tokenId: tokenId,
    email: email,
    password: defaultPassword,
    firstName: firstName,
    lastName: lastName,
    role: role,
    isVerified: isVerified,
  };
}

export function generateSuperAdminAccounts(teamId, tokenId) {
  return defaultAdmins.map((admin) =>
    generateAccount(
      teamId,
      tokenId,
      `${admin.email}@${companyMailDomain}`,
      admin.firstName,
      admin.lastName,
      UserRole.SuperAdmin,
      true,
    ),
  );
}
