import * as Fs from 'fs';

import { Config } from '../config';
import { EmailType } from './enums';

export function replaceTagsOnMailString(
  text: string,
  substitutes: any,
): string {
  substitutes['contactLink'] = Config.contactLink;
  substitutes['instagramLink'] = Config.instagramLink;
  substitutes['twitterLink'] = Config.twitterLink;
  substitutes['facebookLink'] = Config.facebookLink;
  substitutes['mailAssetsUrl'] = Config.mailAssetsUrl;
  const keys = Object.keys(substitutes);
  keys.forEach((key) => {
    text = text.replace(new RegExp('{{' + key + '}}', 'g'), substitutes[key]);
  });
  return text;
}

export const EmailTemplateSubjects = {
  [EmailType.ConfirmRegister]: 'Confirm your email address',
  [EmailType.ForgotPassword]: 'Reset your password',
  [EmailType.ConfirmInvitation]: `You have received an invite to join {{teamName}} from your friend {{name}}`,
  [EmailType.ConfirmRewardRegister]: `Your friend {{friendName}} has successfully registered for {{teamName}}`,
  [EmailType.ConfirmRewardPlay]: `Your friend {{friendName}} has successfully completed their first game/challenge/poll on {{teamName}}`,
  [EmailType.ConfirmRegisterPlatform]: `Hello, thanks for creating your {{platformName}} platform with SportzFan.`,
};

export const EmailTextContents = {
  [EmailType.ConfirmRegister]: `{{name}}, Thank you for joining Adelaide Giants and getting started on the next generation of fan experience.\n
  Start being rewarded for your fandom and take your fan experience to the next level.\n
  Play games, complete challenges and compete against other fans to access exclusive experiences, offers and content.\n
  Please use this link to get started. {{activateLink}}`,
  [EmailType.ForgotPassword]: `Hello {{name}}, To reset your online account password, please click on the link below and follow the instructions. If you have any concerns about this request, please let us know by replying
  to this email. {{resetLink}}`,
  [EmailType.ConfirmInvitation]: `Hello! Your friend {{name}} has invited you to join an exciting new fan engagement platform.\n
  Play games, complete challenges and win exclusive VIP experiences, items and content of the {{teamName}}.\n
  Start being rewarded for your fandom and take your fan experience to the next level.\n
  Get started now, it is free to join and play!\n
  Please use this link to sign up. {{registerLink}}`,
  [EmailType.ConfirmRewardRegister]: `Hello {{name}}, Your friend {{friendName}} has joined {{teamName}} from your referral.\n
  You have received {{token}} tokens and {{kudos}} kudos points for successfully referring them to join.\n
  We have added these rewards to your account.\n
  Please use this link to view wallet. {{walletLink}}`,
  [EmailType.ConfirmRewardPlay]: `Hello {{name}}, Your friend {{friendName}} has played their first game, completed their first challenge or their first poll on {{teamName}} from your referral.\n
  You have received {{token}} tokens and {{kudos}} kudos points for successfully referring them to join and complete an action.\n
  We have added these rewards to your account.\n
  Keep sharing the love by referring others to {{teamName}} and earning more rewards!\n
  Please use this link to refer others. {{referralLink}}\n
  Please use this link to view wallet. {{walletLink}}`,
  [EmailType.ConfirmRegisterPlatform]: `Hello, \n
  Thank you for creating your {{platformName}} and embarking on creating a next generation experience for your fans while supercharging their loyalty. \n
  Here is some important information in relation to your platform: \n
  - To view your platform in action: \n
    1) Go to https://{{platformUrl}}.{{appDomain}} \n
    2) Create an account as a user to view and interact with the platform. \n
  - To view your admin panel: \n
    1) Go to https://{{adminDomain}} \n
    2) Login email: {{adminEmail}} \n
    3) Password: {{adminPassword}} \n
    4) Once logged in, you can view all elements of the admin panel and begin to customise your platform or create content. \n
  If you have any concerns or questions please contact our support team at contact@sportzfan.io \n
  We look forward to helping you supercharge your fan loyalty.`,
};

export function emailTemplate(code: EmailType): string {
  const filePath = `${__dirname}/../../templates/${code}.html`;
  if (Fs.existsSync(filePath)) {
    const html = Fs.readFileSync(filePath);
    return html.toString();
  } else {
    const footer =
      `Need help? <a href="${Config.contactLink}" target="_blank">Contact our support team</a><br>` +
      ``;
    return `${EmailTextContents[code]}<br><br>${footer}`;
  }
}

export function emailText(code: EmailType): string {
  const footer = `Need help? Please use this link to contact our support team. ${Config.contactLink}`;
  return `${EmailTextContents[code]}\n\n${footer}`;
}
