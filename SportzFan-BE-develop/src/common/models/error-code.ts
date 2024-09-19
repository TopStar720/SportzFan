export const ErrorCode = {
  EmailNotRegistered: { code: 10001, message: 'Your email is not registered' },
  PasswordIncorrect: { code: 10002, message: 'Your password is incorrect' },
  UserNotVerified: { code: 10003, message: 'User is not verified yet' },
  UserNotActivated: { code: 10004, message: 'User not activated yet' },
  EmailNotRegisteredAsAdmin: {
    code: 10005,
    message: 'Email is not registered as Admin',
  },
  EmailTaken: {
    code: 10006,
    message: 'Email is already taken.',
  },
  UserCreateFailed: {
    code: 10007,
    message: 'New user creating failed.',
  },
  OnlyAdminAllowedSuperAdminSite: {
    code: 10008,
    message: 'Admin only allowed to SuperAdmin Website.',
  },
  DuplicatedPlatformUrl: {
    code: 30001,
    message: 'Platform url is already taken.',
  },
  DuplicatedAdminEmail: {
    code: 30002,
    message: 'Admin email already exist.',
  },
  OnlyBooleanActivation: {
    code: 30003,
    message: 'Activate param must be boolean.',
  },
  MiniGameSurveyQuestionOverLimit: {
    code: 70001,
    message: 'Survey should have equal or less than 10 questions.',
  },
  MiniGameSurveyRewardItemOverLimit: {
    code: 70002,
    message: 'Survey should have equal or less than 2 reward items.',
  },
  MiniGameNoLifeParam: {
    code: 70003,
    message: 'Could not find mini game life.',
  },
  AlreadyPlayedMiniGame: {
    code: 70004,
    message: 'Already Played MiniGame.',
  },
  NotTeamMiniGame: {
    code: 70005,
    message: 'You should play only team mini-game.',
  },
  MiniGameExpired: {
    code: 70006,
    message: 'MiniGame Expired.',
  },
  MiniGameNotStarted: {
    code: 70007,
    message: 'MiniGame Not Started.',
  },
  MiniGameEnded: {
    code: 70008,
    message: 'MiniGame Ended.',
  },
  NotEligibleForMiniGame: {
    code: 70008,
    message: 'You are not eligible because of insufficient balance.',
  },
  MiniGameNotEnded: {
    code: 70009,
    message: 'MiniGame Not Ended.',
  },
  TeamNotFound: { code: 20001, message: 'Team not found' },
  TeamTokenNotFound: { code: 20002, message: 'Token not found' },
  UserNotFound: { code: 20003, message: 'User not found' },
  SponsorNotFound: { code: 20004, message: 'Sponsor not found' },
  AssetNotFound: { code: 20005, message: 'Asset not found' },
  MiniGameNotFound: { code: 20006, message: 'Mini-Game not found' },
  PushNotificationHistoryNotFound: { code: 20007, message: 'PushNotification-History not found' },
  UnknownServerError: { code: 99999, message: 'New user creating failed' },
};
