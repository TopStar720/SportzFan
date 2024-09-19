import * as dotenv from 'dotenv';
dotenv.config();

export const Config = {
  companyName: 'SportzFan',
  mailDomain: 'sportzfan.io',
  contactLink: 'https://www.sparkupstudios.com.au/contact',
  instagramLink: 'https://www.instagram.com/sportzfanapp',
  twitterLink: 'https://www.twitter.com/sportzfanapp',
  facebookLink: 'https://www.facebook.com/sportzfanapp',
  mailAssetsUrl: `${process.env.STORAGE_HOST}/mail-assets`,
};
