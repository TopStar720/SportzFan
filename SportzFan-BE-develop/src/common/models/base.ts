export enum OrderStatus {
  initial,
  estimated,
  agreed,
  repaired,
  ended,
  canceled,
}

export enum TransactionType {
  Deposit = 'Deposit',
  Transfer = 'Transfer',
  TriviaReward = 'TriviaReward',
  MiniGameReward = 'MiniGameReward',
  PredictionReward = 'PredictionReward',
  MilestoneReward = 'MilestoneReward',
  CheckInReward = 'CheckInReward',
  MultiCheckInReward = 'MultiCheckInReward',
  MultiReferrerReward = 'MultiReferrerReward',
  SurveyReward = 'SurveyReward',
  PollReward = 'PollReward',
  AssetReward = 'AssetReward',
  TriviaEligible = 'TriviaEligible',
  PredictionEligible = 'PredictionEligible',
  MilestoneEligible = 'MilestoneEligible',
  CheckInEligible = 'CheckInEligible',
  PredictionPlay = 'PredictionPlay',
  TriviaPlay = 'TriviaPlay',
  MiniGamePlay = 'MiniGamePlay',
  MultiCheckInEligible = 'MultiCheckInEligible',
  MultiReferrerEligible = 'MultiReferrerEligible',
  SurveyEligible = 'SurveyEligible',
  PollEligible = 'PollEligible',
  AssetEligible = 'AssetEligible',
  ProfileRewardLastName = 'ProfileRewardLastName',
  ProfileRewardBirthday = 'ProfileRewardBirthday',
  ProfileRewardGender = 'ProfileRewardGender',
  ProfileRewardEmail = 'ProfileRewardEmail',
  ProfileRewardPhone = 'ProfileRewardPhone',
  ProfileRewardLocationCountry = 'ProfileRewardLocationCountry',
  ProfileRewardLocationState = 'ProfileRewardLocationState',
  ProfileRewardLocationCity = 'ProfileRewardLocationCity',
  ProfileRewardFavPlayer = 'ProfileRewardFavPlayer',
  ProfileRewardFantype = 'ProfileRewardFantype',
  ProfileReward = 'ProfileReward',
  EarlySignUpReward = 'EarlySignUpReward',
  ReferralSignUpReward = 'ReferralSignUpReward',
  ReferralPlayReward = 'ReferralPlayReward',
}

export enum PlayModel {
  football = 'football',
  baseball = 'baseball',
  basketball = 'basketball',
}

export enum ChallengeType {
  CheckIn = 'CheckIn',
  Survey = 'Survey',
  MultiReferrer = 'MultiReferrer',
  MultiCheckIn = 'MultiCheckIn',
}

export enum MaterialType {
  Poll = 'Poll',
  Asset = 'Asset',
}

export enum MatchType {
  Team = 'Team',
  Sponsor = 'Sponsor',
}

export enum PredictionType {
  Score = 'Score',
  WinningOutCome = 'WinningOutCome',
}

export enum TriviaType {
  MultiChoiceSingleAnswer = 'MultiChoiceSingleAnswer',
  WhoAmI = 'WhoAmI',
}

export enum GameType {
  Prediction = 'Prediction',
  Trivia = 'Trivia',
  Milestone = 'Milestone',
  MiniGame = 'MiniGame',
}

export enum SponsorCategory {
  FoodDining = 'FoodDining',
  Fashion = 'Fashion',
  Retail = 'Retail',
  Auto = 'Auto',
  Insurance = 'Insurance',
  HealthAndWellness = 'Health & Wellness',
}

export enum UserRole {
  SuperAdmin = 'SuperAdmin',
  TeamAdmin = 'TeamAdmin',
  Fan = 'Fan',
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
  Unset = '',
}

export enum SponsorFilter {
  Upcoming = 'Upcoming',
  Ongoing = 'Ongoing',
  Past = 'Past',
}

export enum MatchFilter {
  Draft = 'Draft',
  Expired = 'Expired',
  Upcoming = 'Upcoming',
  Ongoing = 'Ongoing',
}

export enum ChallengeFilter {
  Upcoming = 'Upcoming',
  Ongoing = 'Ongoing',
  Past = 'Past',
  All = 'All',
}

export enum PaymentMethod {
  Bank = 'BANK',
  CreditCard = 'CREDIT_CARD',
  Cash = 'CASH',
  Finance = 'FINANCE',
}

export enum GameFilter {
  Upcoming = 'Upcoming',
  Ongoing = 'Ongoing',
  Past = 'Past',
}

export enum TransactionStatus {
  Pending = 'Pending',
  Failed = 'Failed',
  Success = 'Success',
}

export enum SortFilter {
  Title = 'title',
  Team = 'team',
  Type = 'type',
  Start = 'start',
}

export enum AssetSortFilter {
  Title = 'title',
  Team = 'team',
  Type = 'type',
  Start = 'start',
  Category = 'category',
}

export enum DirectionFilter {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum UserSortFilter {
  UserName = 'userName',
  CreatedAt = 'createdAt',
  Name = 'name',
  Email = 'email',
  Phone = 'phone',
  Activate = 'isActivated',
}

export enum PushNotificationSortFilter {
  Title = 'title',
  Team = 'team',
  user = 'user',
  scheduleDate = 'schedule_date',
  status = 'is_schedule',
}

export enum MiniGameType {
  Soccer,
  Rugby,
  Hockey,
  Cricket,
  Baseball,
  Volleyball,
}

export enum BoosterType {
  Team,
  Sponsor,
}

export enum UnlockRewardType {
  GameCoins,
  GameLives,
  GameBooster,
}

export enum RewardActionType {
  WatchVideo,
  CompleteSurvey,
}

export enum RewardActionRewardItemType {
  GameLives,
  InGameCoins,
}

export enum MarketplaceItemType {
  Team,
  Sponsor,
}

export enum MarketplaceItemSubType {
  Tokens,
  Kudos,
  GameLives,
}

export enum PushNotificationCriteriaType {
  Challenge,
  Poll,
  Inactive,
  Favourite,
  Token,
  Game,
}

export enum FontType {
  Goldman,
  Poppins,
  Roboto,
  OpenSans,
  Montserrat,
  Lato,
  SourceSansPro,
  Oswald,
  Kanit,
  Play,
}
