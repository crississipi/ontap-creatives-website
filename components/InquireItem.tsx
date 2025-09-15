"use client"

import React, { useRef, useState } from 'react'
import ProductCard from './ProductCard'
import { ProductCardProps, ProductProps } from '@/types';
import { HiOutlineArrowLongRight, HiOutlineArrowSmallLeft, HiOutlineXMark, HiPhone } from 'react-icons/hi2';
import Image from 'next/image';
import { HiLocationMarker } from 'react-icons/hi';
import { TbCaretDownFilled } from 'react-icons/tb';
import Toast from './Toast';

type ProdCard = ProductCardProps & ProductProps;

type Country = {
  icon: string
  country: string
  code: string
  regex?: RegExp
  format?: (value: string) => string
  placeholder?: string
  maxDigits: number
}

// Utility formatter
const makeFormatter = (groups: number[], separator: string = " ") => {
  return (value: string) => {
    let digits = value.replace(/\D/g, ""); // strip non-digits
    let result = "";
    let idx = 0;

    for (let i = 0; i < groups.length && idx < digits.length; i++) {
      let part = digits.slice(idx, idx + groups[i]);
      result += part;
      idx += groups[i];
      if (idx < digits.length) result += separator;
    }

    // if extra digits remain
    if (idx < digits.length) {
      result += separator + digits.slice(idx);
    }

    return result;
  };
};

const countries: Country[] = [
{
  icon: '🇦🇫',
  country: 'Afghanistan',
  code: '+93',
  regex: /^(\+93|0)?7\d{8}$/,
  format: makeFormatter([3,3,3]),
  placeholder: '+93 701 234 567',
  maxDigits: 9, // local mobile numbers are 9 digits
},
{
  icon: '🇦🇱',
  country: 'Albania',
  code: '+355',
  regex: /^(\+355|0)?6\d{8}$/,
  format: makeFormatter([3,3,3]),
  placeholder: '+355 682 123 456',
  maxDigits: 9,
},
{
  icon: '🇩🇿',
  country: 'Algeria',
  code: '+213',
  regex: /^(\+213|0)?(5|6|7)\d{8}$/,
  format: makeFormatter([3,2,2,2]),
  placeholder: '+213 551 23 45 67',
  maxDigits: 9,
},
{
  icon: '🇦🇩',
  country: 'Andorra',
  code: '+376',
  regex: /^(\+376)?\d{6}$/,
  format: makeFormatter([3,3]),
  placeholder: '+376 123 456',
  maxDigits: 6,
},
{
  icon: '🇦🇴',
  country: 'Angola',
  code: '+244',
  regex: /^(\+244)?9\d{8}$/,
  format: makeFormatter([3,3,3]),
  placeholder: '+244 923 456 789',
  maxDigits: 9,
},
{
  icon: '🇦🇬',
  country: 'Antigua and Barbuda',
  code: '+1-268',
  regex: /^(\+1-268|268)?\d{7}$/,
  format: makeFormatter([3,4], "-"),
  placeholder: '+1-268 464-1234',
  maxDigits: 7,
},
{
  icon: '🇦🇷',
  country: 'Argentina',
  code: '+54',
  regex: /^(\+54|0)?9?\d{10}$/,
  format: makeFormatter([2,4,4]),
  placeholder: '+54 9 11 2345-6789',
  maxDigits: 10,
},
{
  icon: '🇦🇲',
  country: 'Armenia',
  code: '+374',
  regex: /^(\+374|0)?(77|91|93|94|95|96|97|98|99)\d{6}$/,
  format: makeFormatter([2,3,3]),
  placeholder: '+374 77 123 456',
  maxDigits: 8, // prefix 2 digits + 6 digit local
},
{
  icon: '🇦🇺',
  country: 'Australia',
  code: '+61',
  regex: /^(\+61|0)?4\d{8}$/,
  format: makeFormatter([3,3,3]),
  placeholder: '+61 412 345 678',
  maxDigits: 9,
},
{
  icon: '🇦🇹',
  country: 'Austria',
  code: '+43',
  regex: /^(\+43|0)?6\d{8,10}$/,
  format: makeFormatter([3,3,4]),
  placeholder: '+43 664 123 4567',
  maxDigits: 10,
},
{
  icon: '🇦🇿',
  country: 'Azerbaijan',
  code: '+994',
  regex: /^(\+994|0)?(50|51|55|70|77)\d{7}$/,
  format: makeFormatter([2,3,2,2]),
  placeholder: '+994 50 123 45 67',
  maxDigits: 9,
},


  {
  icon: '🇧🇸',
  country: 'Bahamas',
  code: '+1-242',
  regex: /^(\+1-242|242)?\d{7}$/,
  format: makeFormatter([3, 4], "-"),
  maxDigits: 7,
  placeholder: '+1-242 359-1234',
},
{
  icon: '🇧🇭',
  country: 'Bahrain',
  code: '+973',
  regex: /^(\+973)?3\d{7}$/,
  format: makeFormatter([4, 4]),
  maxDigits: 8,
  placeholder: '+973 3600 1234',
},
{
  icon: '🇧🇩',
  country: 'Bangladesh',
  code: '+880',
  regex: /^(\+880|0)?1[3-9]\d{8}$/,
  format: makeFormatter([3, 3, 4]),
  maxDigits: 10,
  placeholder: '+880 171 234 5678',
},
{
  icon: '🇧🇧',
  country: 'Barbados',
  code: '+1-246',
  regex: /^(\+1-246|246)?\d{7}$/,
  format: makeFormatter([3, 4], "-"),
  maxDigits: 7,
  placeholder: '+1-246 250-1234',
},
{
  icon: '🇧🇾',
  country: 'Belarus',
  code: '+375',
  regex: /^(\+375|80)?(29|33|44|25)\d{7}$/,
  format: makeFormatter([2, 3, 2, 2]),
  maxDigits: 9,
  placeholder: '+375 29 123 45 67',
},
{
  icon: '🇧🇪',
  country: 'Belgium',
  code: '+32',
  regex: /^(\+32|0)?4\d{8}$/,
  format: makeFormatter([3, 2, 2, 2]),
  maxDigits: 9,
  placeholder: '+32 472 12 34 56',
},
{
  icon: '🇧🇿',
  country: 'Belize',
  code: '+501',
  regex: /^(\+501)?[67]\d{6}$/,
  format: makeFormatter([3, 4], "-"),
  maxDigits: 7,
  placeholder: '+501 622-1234',
},
{
  icon: '🇧🇯',
  country: 'Benin',
  code: '+229',
  regex: /^(\+229)?[69]\d{7}$/,
  format: makeFormatter([2, 2, 2, 2]),
  maxDigits: 8,
  placeholder: '+229 97 12 34 56',
},
{
  icon: '🇧🇹',
  country: 'Bhutan',
  code: '+975',
  regex: /^(\+975)?17\d{6}$/,
  format: makeFormatter([2, 2, 4]),
  maxDigits: 8,
  placeholder: '+975 17 12 3456',
},
{
  icon: '🇧🇴',
  country: 'Bolivia',
  code: '+591',
  regex: /^(\+591|0)?[67]\d{7}$/,
  format: makeFormatter([1, 3, 4]),
  maxDigits: 8,
  placeholder: '+591 7 612 3456',
},
{
  icon: '🇧🇦',
  country: 'Bosnia and Herzegovina',
  code: '+387',
  regex: /^(\+387|0)?6\d{7}$/,
  format: makeFormatter([2, 3, 3]),
  maxDigits: 8,
  placeholder: '+387 61 234 567',
},
{
  icon: '🇧🇼',
  country: 'Botswana',
  code: '+267',
  regex: /^(\+267)?7\d{7}$/,
  format: makeFormatter([2, 3, 3]),
  maxDigits: 8,
  placeholder: '+267 71 234 567',
},
{
  icon: '🇧🇷',
  country: 'Brazil',
  code: '+55',
  regex: /^(\+55|0)?[1-9]{2}9\d{8}$/,
  format: makeFormatter([2, 5, 4]), // (11) 91234-5678
  maxDigits: 11,
  placeholder: '+55 (11) 91234-5678',
},
{
  icon: '🇧🇳',
  country: 'Brunei',
  code: '+673',
  regex: /^(\+673)?[678]\d{6}$/,
  format: makeFormatter([3, 4]),
  maxDigits: 7,
  placeholder: '+673 712 3456',
},
{
  icon: '🇧🇬',
  country: 'Bulgaria',
  code: '+359',
  regex: /^(\+359|0)?8\d{8}$/,
  format: makeFormatter([3, 3, 3]),
  maxDigits: 9,
  placeholder: '+359 888 123 456',
},
{
  icon: '🇧🇫',
  country: 'Burkina Faso',
  code: '+226',
  regex: /^(\+226)?[67]\d{7}$/,
  format: makeFormatter([2, 2, 2, 2]),
  maxDigits: 8,
  placeholder: '+226 70 12 34 56',
},
{
  icon: '🇧🇮',
  country: 'Burundi',
  code: '+257',
  regex: /^(\+257)?7\d{7}$/,
  format: makeFormatter([2, 2, 2, 2]),
  maxDigits: 8,
  placeholder: '+257 79 12 34 56',
},

{
  icon: '🇰🇭',
  country: 'Cambodia',
  code: '+855',
  regex: /^(\+855|0)?(1\d{8}|[89]\d{7,8})$/,
  format: makeFormatter([2,3,3]),
  placeholder: '+855 12 345 678',
  maxDigits: 9,
},
{
  icon: '🇨🇲',
  country: 'Cameroon',
  code: '+237',
  regex: /^(\+237)?6\d{8}$/,
  format: makeFormatter([3,3,3]),
  placeholder: '+237 671 234 567',
  maxDigits: 9,
},
{
  icon: '🇨🇦',
  country: 'Canada',
  code: '+1',
  regex: /^(\+1|1)?\d{10}$/,
  format: makeFormatter([3,3,4], "-"),
  placeholder: '+1 416-555-0199',
  maxDigits: 10,
},
{
  icon: '🇨🇻',
  country: 'Cape Verde',
  code: '+238',
  regex: /^(\+238)?9\d{6}$/,
  format: makeFormatter([3,2,2]),
  placeholder: '+238 991 23 45',
  maxDigits: 7,
},
{
  icon: '🇨🇫',
  country: 'Central African Republic',
  code: '+236',
  regex: /^(\+236)?7\d{7}$/,
  format: makeFormatter([2,2,2,2]),
  placeholder: '+236 70 12 34 56',
  maxDigits: 8,
},
{
  icon: '🇹🇩',
  country: 'Chad',
  code: '+235',
  regex: /^(\+235)?6\d{7}$/,
  format: makeFormatter([2,2,2,2]),
  placeholder: '+235 63 12 34 56',
  maxDigits: 8,
},
{
  icon: '🇨🇱',
  country: 'Chile',
  code: '+56',
  regex: /^(\+56|0)?9\d{8}$/,
  format: makeFormatter([1,4,4]),
  placeholder: '+56 9 6123 4567',
  maxDigits: 9,
},
{
  icon: '🇨🇳',
  country: 'China',
  code: '+86',
  regex: /^(\+86|0)?1[3-9]\d{9}$/,
  format: makeFormatter([3,4,4]),
  placeholder: '+86 138 1234 5678',
  maxDigits: 11,
},
{
  icon: '🇨🇴',
  country: 'Colombia',
  code: '+57',
  regex: /^(\+57|0)?3\d{9}$/,
  format: makeFormatter([3,3,4]),
  placeholder: '+57 321 456 7890',
  maxDigits: 10,
},
{
  icon: '🇰🇲',
  country: 'Comoros',
  code: '+269',
  regex: /^(\+269)?3\d{6}$/,
  format: makeFormatter([3,4]),
  placeholder: '+269 321 2345',
  maxDigits: 7,
},
{
  icon: '🇨🇬',
  country: 'Congo',
  code: '+242',
  regex: /^(\+242)?0?[14-6]\d{7}$/,
  format: makeFormatter([2,3,3]),
  placeholder: '+242 06 123 4567',
  maxDigits: 9,
},
{
  icon: '🇨🇷',
  country: 'Costa Rica',
  code: '+506',
  regex: /^(\+506)?[67]\d{7}$/,
  format: makeFormatter([4,4]),
  placeholder: '+506 7123 4567',
  maxDigits: 8,
},
{
  icon: '🇭🇷',
  country: 'Croatia',
  code: '+385',
  regex: /^(\+385|0)?9\d{8}$/,
  format: makeFormatter([2,3,4]),
  placeholder: '+385 91 123 4567',
  maxDigits: 9,
},
{
  icon: '🇨🇺',
  country: 'Cuba',
  code: '+53',
  regex: /^(\+53)?5\d{7}$/,
  format: makeFormatter([1,3,4]),
  placeholder: '+53 5 123 4567',
  maxDigits: 8,
},
{
  icon: '🇨🇾',
  country: 'Cyprus',
  code: '+357',
  regex: /^(\+357)?9\d{7}$/,
  format: makeFormatter([2,3,3]),
  placeholder: '+357 99 123 456',
  maxDigits: 8,
},
{
  icon: '🇨🇿',
  country: 'Czechia',
  code: '+420',
  regex: /^(\+420)?[67]\d{8}$/,
  format: makeFormatter([3,3,3]),
  placeholder: '+420 601 123 456',
  maxDigits: 9,
},


{
  icon: '🇩🇰',
  country: 'Denmark',
  code: '+45',
  regex: /^(\+45)?\d{8}$/,
  format: makeFormatter([2,2,2,2]), // 12 34 56 78
  placeholder: '+45 12 34 56 78',
  maxDigits: 8,
},
{
  icon: '🇩🇯',
  country: 'Djibouti',
  code: '+253',
  regex: /^(\+253)?[67]\d{7}$/,
  format: makeFormatter([2,2,2,2]), // 77 12 34 56
  placeholder: '+253 77 12 34 56',
  maxDigits: 8,
},
{
  icon: '🇩🇲',
  country: 'Dominica',
  code: '+1-767',
  regex: /^(\+1-767|767)?\d{7}$/,
  format: makeFormatter([3,4], "-"), // 225-1234
  placeholder: '+1-767 225-1234',
  maxDigits: 7,
},
{
  icon: '🇩🇴',
  country: 'Dominican Republic',
  code: '+1',
  regex: /^(\+1|1)?(809|829|849)\d{7}$/,
  format: makeFormatter([3,3,4], "-"), // 809-234-5678
  placeholder: '+1 809-234-5678',
  maxDigits: 10,
},
{
  icon: '🇪🇨',
  country: 'Ecuador',
  code: '+593',
  regex: /^(\+593|0)?9\d{8}$/,
  format: makeFormatter([2,3,4]), // 99 123 4567
  placeholder: '+593 99 123 4567',
  maxDigits: 9,
},
{
  icon: '🇪🇬',
  country: 'Egypt',
  code: '+20',
  regex: /^(\+20|0)?1[0-2,5]\d{8}$/,
  format: makeFormatter([2,4,4]), // 10 1234 5678
  placeholder: '+20 10 1234 5678',
  maxDigits: 10,
},
{
  icon: '🇸🇻',
  country: 'El Salvador',
  code: '+503',
  regex: /^(\+503)?[67]\d{7}$/,
  format: makeFormatter([4,4]), // 7012 3456
  placeholder: '+503 7012 3456',
  maxDigits: 8,
},
{
  icon: '🇬🇶',
  country: 'Equatorial Guinea',
  code: '+240',
  regex: /^(\+240)?[235]\d{8}$/,
  format: makeFormatter([3,3,3]), // 222 123 456
  placeholder: '+240 222 123 456',
  maxDigits: 9,
},
{
  icon: '🇪🇷',
  country: 'Eritrea',
  code: '+291',
  regex: /^(\+291)?7\d{6}$/,
  format: makeFormatter([2,3,3]), // 71 234 567
  placeholder: '+291 71 234 567',
  maxDigits: 7,
},
{
  icon: '🇪🇪',
  country: 'Estonia',
  code: '+372',
  regex: /^(\+372)?(5\d{7}|8\d{7})$/,
  format: makeFormatter([3,2,3]), // 512 34 567
  placeholder: '+372 512 34 567',
  maxDigits: 8,
},
{
  icon: '🇸🇿',
  country: 'Eswatini',
  code: '+268',
  regex: /^(\+268)?7\d{7}$/,
  format: makeFormatter([2,3,3]), // 76 123 456
  placeholder: '+268 76 123 456',
  maxDigits: 8,
},
{
  icon: '🇪🇹',
  country: 'Ethiopia',
  code: '+251',
  regex: /^(\+251|0)?9\d{8}$/,
  format: makeFormatter([2,3,3,2]), // 91 123 4567
  placeholder: '+251 91 123 4567',
  maxDigits: 9,
},



  {
  icon: '🇫🇯',
  country: 'Fiji',
  code: '+679',
  regex: /^(\+679)?[2-9]\d{6}$/,
  format: makeFormatter([3,4]), // 701 2345
  placeholder: '+679 701 2345',
  maxDigits: 7,
},
{
  icon: '🇫🇮',
  country: 'Finland',
  code: '+358',
  regex: /^(\+358|0)?4\d{8}$/,
  format: makeFormatter([2,3,3,2]), // 40 123 4567
  placeholder: '+358 40 123 4567',
  maxDigits: 9,
},
{
  icon: '🇫🇷',
  country: 'France',
  code: '+33',
  regex: /^(\+33|0)?[67]\d{8}$/,
  format: makeFormatter([1,2,2,2,2]), // 6 12 34 56 78
  placeholder: '+33 6 12 34 56 78',
  maxDigits: 9,
},
{
  icon: '🇬🇦',
  country: 'Gabon',
  code: '+241',
  regex: /^(\+241)?0?[2-7]\d{6}$/,
  format: makeFormatter([2,2,2,2]), // 06 12 34 56
  placeholder: '+241 06 12 34 56',
  maxDigits: 8,
},
{
  icon: '🇬🇲',
  country: 'Gambia',
  code: '+220',
  regex: /^(\+220)?[2369]\d{6}$/,
  format: makeFormatter([3,4]), // 301 2345
  placeholder: '+220 301 2345',
  maxDigits: 7,
},
{
  icon: '🇬🇪',
  country: 'Georgia',
  code: '+995',
  regex: /^(\+995)?5\d{8}$/,
  format: makeFormatter([3,2,2,2]), // 599 12 34 56
  placeholder: '+995 599 12 34 56',
  maxDigits: 9,
},
{
  icon: '🇩🇪',
  country: 'Germany',
  code: '+49',
  regex: /^(\+49|0)?1[5-7]\d{8,9}$/,
  format: makeFormatter([3,3,4]), // 151 234 5678
  placeholder: '+49 151 234 5678',
  maxDigits: 10, // some carriers use 9, but 10 is safest
},
{
  icon: '🇬🇭',
  country: 'Ghana',
  code: '+233',
  regex: /^(\+233|0)?[235]\d{8}$/,
  format: makeFormatter([2,3,3,2]), // 24 123 4567
  placeholder: '+233 24 123 4567',
  maxDigits: 9,
},
{
  icon: '🇬🇷',
  country: 'Greece',
  code: '+30',
  regex: /^(\+30)?6\d{9}$/,
  format: makeFormatter([3,3,4]), // 691 234 5678
  placeholder: '+30 691 234 5678',
  maxDigits: 10,
},
{
  icon: '🇬🇩',
  country: 'Grenada',
  code: '+1-473',
  regex: /^(\+1-473|473)?\d{7}$/,
  format: makeFormatter([3,4], "-"), // 403-1234
  placeholder: '+1-473 403-1234',
  maxDigits: 7,
},
{
  icon: '🇬🇹',
  country: 'Guatemala',
  code: '+502',
  regex: /^(\+502)?[3-5]\d{7}$/,
  format: makeFormatter([4,4]), // 5123 4567
  placeholder: '+502 5123 4567',
  maxDigits: 8,
},
{
  icon: '🇬🇳',
  country: 'Guinea',
  code: '+224',
  regex: /^(\+224)?6\d{8}$/,
  format: makeFormatter([3,2,2,3]), // 601 23 45 67
  placeholder: '+224 601 23 45 67',
  maxDigits: 9,
},
{
  icon: '🇬🇼',
  country: 'Guinea-Bissau',
  code: '+245',
  regex: /^(\+245)?9\d{7}$/,
  format: makeFormatter([3,2,2,2]), // 955 12 34 56
  placeholder: '+245 955 12 34 56',
  maxDigits: 8,
},
{
  icon: '🇬🇾',
  country: 'Guyana',
  code: '+592',
  regex: /^(\+592)?6\d{6}$/,
  format: makeFormatter([3,4]), // 601 2345
  placeholder: '+592 601 2345',
  maxDigits: 7,
},

{
  icon: '🇭🇹',
  country: 'Haiti',
  code: '+509',
  regex: /^(\+509)?3\d{7}$/,
  format: makeFormatter([2, 2, 4]),   // 34 12 3456
  placeholder: '+509 34 12 3456',
  maxDigits: 8,
},
{
  icon: '🇭🇳',
  country: 'Honduras',
  code: '+504',
  regex: /^(\+504)?[389]\d{7}$/,
  format: makeFormatter([4, 4]),     // 9123 4567
  placeholder: '+504 9123 4567',
  maxDigits: 8,
},
{
  icon: '🇭🇺',
  country: 'Hungary',
  code: '+36',
  regex: /^(\+36|06)?(20|30|70)\d{7}$/,
  format: makeFormatter([2, 3, 4]),  // 20 123 4567
  placeholder: '+36 20 123 4567',
  maxDigits: 9,
},
{
  icon: '🇮🇸',
  country: 'Iceland',
  code: '+354',
  regex: /^(\+354)?\d{7}$/,
  format: makeFormatter([3, 4]),     // 691 2345
  placeholder: '+354 691 2345',
  maxDigits: 7,
},
{
  icon: '🇮🇳',
  country: 'India',
  code: '+91',
  regex: /^(\+91|0)?[6-9]\d{9}$/,
  format: makeFormatter([5, 5]),     // 98765 43210
  placeholder: '+91 98765 43210',
  maxDigits: 10,
},
{
  icon: '🇮🇩',
  country: 'Indonesia',
  code: '+62',
  regex: /^(\+62|0)?8\d{8,10}$/,
  format: makeFormatter([3, 4, 4], "-"), // 812-3456-7890
  placeholder: '+62 812-3456-7890',
  maxDigits: 11, // can be 9–11 digits, safest to allow 11
},
{
  icon: '🇮🇷',
  country: 'Iran',
  code: '+98',
  regex: /^(\+98|0)?9\d{9}$/,
  format: makeFormatter([3, 3, 4]),  // 912 345 6789
  placeholder: '+98 912 345 6789',
  maxDigits: 10,
},
{
  icon: '🇮🇶',
  country: 'Iraq',
  code: '+964',
  regex: /^(\+964|0)?7\d{9}$/,
  format: makeFormatter([3, 3, 4]),  // 750 123 4567
  placeholder: '+964 750 123 4567',
  maxDigits: 10,
},
{
  icon: '🇮🇪',
  country: 'Ireland',
  code: '+353',
  regex: /^(\+353|0)?8\d{8}$/,
  format: makeFormatter([2, 3, 4]),  // 86 123 4567
  placeholder: '+353 86 123 4567',
  maxDigits: 9,
},
{
  icon: '🇮🇱',
  country: 'Israel',
  code: '+972',
  regex: /^(\+972|0)?5\d{8}$/,
  format: makeFormatter([2, 3, 4]),  // 50 123 4567
  placeholder: '+972 50 123 4567',
  maxDigits: 9,
},
{
  icon: '🇮🇹',
  country: 'Italy',
  code: '+39',
  regex: /^(\+39)?3\d{8,9}$/,
  format: makeFormatter([3, 3, 3, 1]),  // 347 123 4567
  placeholder: '+39 347 123 4567',
  maxDigits: 10, // allows both 9 or 10
},

{
  icon: '🇯🇲',
  country: 'Jamaica',
  code: '+1-876',
  regex: /^(\+1-876|876)?\d{7}$/,
  format: makeFormatter([3, 4], "-"), // 512-3456
  placeholder: '+1-876 512-3456',
  maxDigits: 7,
},
{
  icon: '🇯🇵',
  country: 'Japan',
  code: '+81',
  regex: /^(\+81|0)?[789]0\d{8}$/,
  format: makeFormatter([2, 4, 4]),  // 90 1234 5678
  placeholder: '+81 90 1234 5678',
  maxDigits: 10,
},
{
  icon: '🇯🇴',
  country: 'Jordan',
  code: '+962',
  regex: /^(\+962|0)?7[789]\d{7}$/,
  format: makeFormatter([2, 3, 4]),  // 79 123 4567
  placeholder: '+962 79 123 4567',
  maxDigits: 9,
},
{
  icon: '🇰🇿',
  country: 'Kazakhstan',
  code: '+7',
  regex: /^(\+7|8)?7\d{9}$/,
  format: makeFormatter([3, 3, 4]),  // 701 123 4567
  placeholder: '+7 701 123 4567',
  maxDigits: 10,
},
{
  icon: '🇰🇪',
  country: 'Kenya',
  code: '+254',
  regex: /^(\+254|0)?7\d{8}$/,
  format: makeFormatter([3, 3, 3]),  // 712 345 678
  placeholder: '+254 712 345 678',
  maxDigits: 9,
},
{
  icon: '🇰🇮',
  country: 'Kiribati',
  code: '+686',
  regex: /^(\+686)?[27]\d{4}$/,
  format: makeFormatter([2, 2, 2]),  // 22 12 34
  placeholder: '+686 22 1234',
  maxDigits: 5,
},
{
  icon: '🇽🇰',
  country: 'Kosovo',
  code: '+383',
  regex: /^(\+383)?4[4-9]\d{6}$/,
  format: makeFormatter([2, 3, 3]),  // 44 123 456
  placeholder: '+383 44 123 456',
  maxDigits: 8,
},
{
  icon: '🇰🇼',
  country: 'Kuwait',
  code: '+965',
  regex: /^(\+965)?[569]\d{7}$/,
  format: makeFormatter([4, 4]),     // 5012 3456
  placeholder: '+965 5012 3456',
  maxDigits: 8,
},
{
  icon: '🇰🇬',
  country: 'Kyrgyzstan',
  code: '+996',
  regex: /^(\+996|0)?7\d{8}$/,
  format: makeFormatter([3, 3, 3]),  // 700 123 456
  placeholder: '+996 700 123 456',
  maxDigits: 9,
},
{
  icon: '🇱🇦',
  country: 'Laos',
  code: '+856',
  regex: /^(\+856|0)?20\d{8}$/,
  format: makeFormatter([2, 2, 3, 3]), // 20 23 456 789
  placeholder: '+856 20 23 456 789',
  maxDigits: 10,
},
{
  icon: '🇱🇻',
  country: 'Latvia',
  code: '+371',
  regex: /^(\+371)?2\d{7}$/,
  format: makeFormatter([2, 3, 3]), // 21 234 567
  placeholder: '+371 21 234 567',
  maxDigits: 8,
},
{
  icon: '🇱🇧',
  country: 'Lebanon',
  code: '+961',
  regex: /^(\+961)?(3|7)\d{6}$/,
  format: makeFormatter([2, 3, 3]), // 3 123 456
  placeholder: '+961 3 123 456',
  maxDigits: 7,
},
{
  icon: '🇱🇸',
  country: 'Lesotho',
  code: '+266',
  regex: /^(\+266)?[56]\d{7}$/,
  format: makeFormatter([2, 3, 3]), // 58 123 456
  placeholder: '+266 58 123 456',
  maxDigits: 8,
},
{
  icon: '🇱🇷',
  country: 'Liberia',
  code: '+231',
  regex: /^(\+231)?(77|88)\d{7}$/,
  format: makeFormatter([2, 3, 4]), // 77 123 4567
  placeholder: '+231 77 123 4567',
  maxDigits: 9,
},
{
  icon: '🇱🇾',
  country: 'Libya',
  code: '+218',
  regex: /^(\+218|0)?9\d{8}$/,
  format: makeFormatter([2, 3, 4]), // 91 234 5678
  placeholder: '+218 91 234 5678',
  maxDigits: 9,
},
{
  icon: '🇱🇮',
  country: 'Liechtenstein',
  code: '+423',
  regex: /^(\+423)?[67]\d{6}$/,
  format: makeFormatter([3, 2, 2]), // 660 12 34
  placeholder: '+423 660 12 34',
  maxDigits: 7,
},
{
  icon: '🇱🇹',
  country: 'Lithuania',
  code: '+370',
  regex: /^(\+370|8)?6\d{7}$/,
  format: makeFormatter([2, 3, 2, 2]), // 61 234 567
  placeholder: '+370 61 234 567',
  maxDigits: 8,
},
{
  icon: '🇱🇺',
  country: 'Luxembourg',
  code: '+352',
  regex: /^(\+352)?6\d{8}$/,
  format: makeFormatter([3, 3, 3]), // 621 234 567
  placeholder: '+352 621 234 567',
  maxDigits: 9,
},

{
  icon: '🇲🇬',
  country: 'Madagascar',
  code: '+261',
  regex: /^(\+261)?3\d{8}$/,
  format: makeFormatter([2, 2, 3, 3]), // 32 12 345 67
  placeholder: '+261 32 12 345 67',
  maxDigits: 9,
},
{
  icon: '🇲🇼',
  country: 'Malawi',
  code: '+265',
  regex: /^(\+265)?(77|88|99)\d{6}$/,
  format: makeFormatter([2, 3, 3]), // 99 123 456
  placeholder: '+265 99 123 456',
  maxDigits: 8,
},
{
  icon: '🇲🇾',
  country: 'Malaysia',
  code: '+60',
  regex: /^(\+60|0)?1\d{8,9}$/,
  format: makeFormatter([2, 4, 4]), // 12 3456 789
  placeholder: '+60 12 3456 789',
  maxDigits: 10,
},
{
  icon: '🇲🇻',
  country: 'Maldives',
  code: '+960',
  regex: /^(\+960)?[79]\d{6}$/,
  format: makeFormatter([3, 4]), // 771 2345
  placeholder: '+960 771 2345',
  maxDigits: 7,
},
{
  icon: '🇲🇱',
  country: 'Mali',
  code: '+223',
  regex: /^(\+223)?[67]\d{7}$/,
  format: makeFormatter([2, 2, 3, 1]), // 76 12 345 6
  placeholder: '+223 76 12 345 6',
  maxDigits: 8,
},
{
  icon: '🇲🇹',
  country: 'Malta',
  code: '+356',
  regex: /^(\+356)?(79|99|77)\d{6}$/,
  format: makeFormatter([4, 4]), // 9912 3456
  placeholder: '+356 9912 3456',
  maxDigits: 8,
},
{
  icon: '🇲🇭',
  country: 'Marshall Islands',
  code: '+692',
  regex: /^(\+692)?[2356]\d{6}$/,
  format: makeFormatter([3, 4]), // 235 1234
  placeholder: '+692 235 1234',
  maxDigits: 7,
},
{
  icon: '🇲🇷',
  country: 'Mauritania',
  code: '+222',
  regex: /^(\+222)?[24]\d{7}$/,
  format: makeFormatter([2, 3, 3]), // 24 123 456
  placeholder: '+222 24 123 456',
  maxDigits: 8,
},
{
  icon: '🇲🇺',
  country: 'Mauritius',
  code: '+230',
  regex: /^(\+230)?[57]\d{7}$/,
  format: makeFormatter([3, 4]), // 5712 3456
  placeholder: '+230 5712 3456',
  maxDigits: 8,
},
{
  icon: '🇲🇽',
  country: 'Mexico',
  code: '+52',
  regex: /^(\+52)?1?\d{10}$/,
  format: makeFormatter([2, 4, 4]), // 55 1234 5678
  placeholder: '+52 55 1234 5678',
  maxDigits: 10,
},
{
  icon: '🇫🇲',
  country: 'Micronesia',
  code: '+691',
  regex: /^(\+691)?[39]\d{6}$/,
  format: makeFormatter([3, 4]), // 320 1234
  placeholder: '+691 320 1234',
  maxDigits: 7,
},
{
  icon: '🇲🇩',
  country: 'Moldova',
  code: '+373',
  regex: /^(\+373)?6\d{7}$/,
  format: makeFormatter([2, 3, 3]), // 68 123 456
  placeholder: '+373 68 123 456',
  maxDigits: 8,
},
{
  icon: '🇲🇨',
  country: 'Monaco',
  code: '+377',
  regex: /^(\+377)?6\d{7}$/,
  format: makeFormatter([2, 2, 2, 2]), // 61 23 45 67
  placeholder: '+377 61 23 45 67',
  maxDigits: 8,
},
{
  icon: '🇲🇳',
  country: 'Mongolia',
  code: '+976',
  regex: /^(\+976)?[89]\d{7}$/,
  format: makeFormatter([2, 2, 3, 2]), // 88 12 345 67
  placeholder: '+976 88 12 345 67',
  maxDigits: 8,
},
{
  icon: '🇲🇪',
  country: 'Montenegro',
  code: '+382',
  regex: /^(\+382)?6\d{7}$/,
  format: makeFormatter([2, 3, 3]), // 67 123 456
  placeholder: '+382 67 123 456',
  maxDigits: 8,
},
{
  icon: '🇲🇦',
  country: 'Morocco',
  code: '+212',
  regex: /^(\+212|0)?6\d{8}$/,
  format: makeFormatter([2, 3, 3, 1]), // 61 234 5678
  placeholder: '+212 61 234 5678',
  maxDigits: 9,
},
{
  icon: '🇲🇿',
  country: 'Mozambique',
  code: '+258',
  regex: /^(\+258)?8[234567]\d{7}$/,
  format: makeFormatter([2, 3, 4]), // 82 123 4567
  placeholder: '+258 82 123 4567',
  maxDigits: 9,
},
{
  icon: '🇲🇲',
  country: 'Myanmar',
  code: '+95',
  regex: /^(\+95|0)?9\d{7,9}$/,
  format: makeFormatter([1, 3, 3]), // 9 123 456 789
  placeholder: '+95 9 123 456 789',
  maxDigits: 10,
},
{
  icon: '🇳🇦',
  country: 'Namibia',
  code: '+264',
  regex: /^(\+264|0)?8\d{7}$/,
  format: makeFormatter([2, 3, 4]), // 81 234 5678
  placeholder: '+264 81 234 5678',
  maxDigits: 9,
},
{
  icon: '🇳🇷',
  country: 'Nauru',
  code: '+674',
  regex: /^(\+674)?[45]\d{6}$/,
  format: makeFormatter([3, 4]), // 555 1234
  placeholder: '+674 555 1234',
  maxDigits: 7,
},
{
  icon: '🇳🇵',
  country: 'Nepal',
  code: '+977',
  regex: /^(\+977|0)?9\d{9}$/,
  format: makeFormatter([2, 4, 4]), // 98 1234 5678
  placeholder: '+977 98 1234 5678',
  maxDigits: 10,
},
{
  icon: '🇳🇱',
  country: 'Netherlands',
  code: '+31',
  regex: /^(\+31|0)?6\d{8}$/,
  format: makeFormatter([1, 4, 4]), // 6 1234 5678
  placeholder: '+31 6 1234 5678',
  maxDigits: 9,
},
{
  icon: '🇳🇿',
  country: 'New Zealand',
  code: '+64',
  regex: /^(\+64|0)?2\d{7,9}$/,
  format: makeFormatter([2, 3, 4]), // 21 234 5678
  placeholder: '+64 21 234 5678',
  maxDigits: 10,
},
{
  icon: '🇳🇮',
  country: 'Nicaragua',
  code: '+505',
  regex: /^(\+505)?[578]\d{7}$/,
  format: makeFormatter([4, 4]), // 8123 4567
  placeholder: '+505 8123 4567',
  maxDigits: 8,
},
{
  icon: '🇳🇪',
  country: 'Niger',
  code: '+227',
  regex: /^(\+227)?9\d{7}$/,
  format: makeFormatter([2, 3, 3]), // 93 123 456
  placeholder: '+227 93 123 456',
  maxDigits: 8,
},
{
  icon: '🇳🇬',
  country: 'Nigeria',
  code: '+234',
  regex: /^(\+234|0)?[789]\d{9}$/,
  format: makeFormatter([3, 3, 4]), // 803 123 4567
  placeholder: '+234 803 123 4567',
  maxDigits: 10,
},
{
  icon: '🇲🇰',
  country: 'North Macedonia',
  code: '+389',
  regex: /^(\+389|0)?7\d{7}$/,
  format: makeFormatter([2, 3, 3]), // 70 123 456
  placeholder: '+389 70 123 456',
  maxDigits: 8,
},
{
  icon: '🇰🇵',
  country: 'North Korea',
  code: '+850',
  regex: /^(\+850)?19\d{6}$/,
  format: makeFormatter([2, 3, 3]), // 19 123 456
  placeholder: '+850 19 123 456',
  maxDigits: 8,
},
{
  icon: '🇳🇴',
  country: 'Norway',
  code: '+47',
  regex: /^(\+47)?[49]\d{7}$/,
  format: makeFormatter([3, 2, 3]), // 412 34 567
  placeholder: '+47 412 34 567',
  maxDigits: 8,
},

{
  icon: '🇴🇲',
  country: 'Oman',
  code: '+968',
  regex: /^(\+968)?9\d{7}$/,
  format: makeFormatter([2, 3, 3]), // 91 234 567
  placeholder: '+968 91 234 567',
  maxDigits: 8,
},
{
  icon: '🇵🇰',
  country: 'Pakistan',
  code: '+92',
  regex: /^(\+92|0)?3\d{9}$/,
  format: makeFormatter([3, 3, 4]), // 300 123 4567
  placeholder: '+92 300 123 4567',
  maxDigits: 10,
},
{
  icon: '🇵🇼',
  country: 'Palau',
  code: '+680',
  regex: /^(\+680)?(68|77)\d{6}$/,
  format: makeFormatter([2, 3, 3]), // 77 123 456
  placeholder: '+680 77 123 456',
  maxDigits: 8,
},
{
  icon: '🇵🇸',
  country: 'Palestine',
  code: '+970',
  regex: /^(\+970|0)?5\d{8}$/,
  format: makeFormatter([2, 3, 3]), // 59 123 4567
  placeholder: '+970 59 123 4567',
  maxDigits: 9,
},
{
  icon: '🇵🇦',
  country: 'Panama',
  code: '+507',
  regex: /^(\+507)?6\d{7}$/,
  format: makeFormatter([4, 4]), // 6123 4567
  placeholder: '+507 6123 4567',
  maxDigits: 8,
},
{
  icon: '🇵🇬',
  country: 'Papua New Guinea',
  code: '+675',
  regex: /^(\+675)?7\d{7}$/,
  format: makeFormatter([3, 4]), // 701 2345
  placeholder: '+675 701 2345',
  maxDigits: 8,
},
{
  icon: '🇵🇾',
  country: 'Paraguay',
  code: '+595',
  regex: /^(\+595|0)?9\d{8}$/,
  format: makeFormatter([2, 3, 4]), // 97 123 4567
  placeholder: '+595 97 123 4567',
  maxDigits: 9,
},
{
  icon: '🇵🇪',
  country: 'Peru',
  code: '+51',
  regex: /^(\+51|0)?9\d{8}$/,
  format: makeFormatter([2, 3, 3]), // 91 234 5678
  placeholder: '+51 91 234 5678',
  maxDigits: 9,
},
{
  icon: '🇵🇭',
  country: 'Philippines',
  code: '+63',
  regex: /^9\d{9}$/, // must start with 9 and have 10 digits
  format: makeFormatter([3, 3, 4]), // 917 123 4567
  placeholder: '+63 917 123 4567',
  maxDigits: 10,
},
{
  icon: '🇵🇱',
  country: 'Poland',
  code: '+48',
  regex: /^(\+48)?[5-8]\d{8}$/,
  format: makeFormatter([3, 3, 3]), // 601 234 567
  placeholder: '+48 601 234 567',
  maxDigits: 9,
},
{
  icon: '🇵🇷',
  country: 'Puerto Rico',
  code: '+1-787',
  regex: /^(\+1-787|\+1-939)?\d{7}$/,
  format: makeFormatter([3, 4]), // 234 5678
  placeholder: '+1-787 234 5678',
  maxDigits: 7,
},
{
  icon: '🇶🇦',
  country: 'Qatar',
  code: '+974',
  regex: /^(\+974)?[3-7]\d{7}$/,
  format: makeFormatter([4, 4]),
  placeholder: '+974 3312 3456',
  maxDigits: 8,
},
{
  icon: '🇷🇴',
  country: 'Romania',
  code: '+40',
  regex: /^(\+40|0)?7\d{8}$/,
  format: makeFormatter([2, 3, 3]),
  placeholder: '+40 72 123 4567',
  maxDigits: 9,
},
{
  icon: '🇷🇺',
  country: 'Russia',
  code: '+7',
  regex: /^(\+7|8)?9\d{9}$/,
  format: makeFormatter([3, 3, 4]),
  placeholder: '+7 912 345 6789',
  maxDigits: 10,
},
{
  icon: '🇷🇼',
  country: 'Rwanda',
  code: '+250',
  regex: /^(\+250)?7\d{8}$/,
  format: makeFormatter([3, 3, 3]),
  placeholder: '+250 788 123 456',
  maxDigits: 9,
},

{
  icon: '🇰🇳',
  country: 'Saint Kitts and Nevis',
  code: '+1-869',
  regex: /^(\+1-869)?\d{7}$/,
  format: makeFormatter([3, 4]),
  maxDigits: 7,
  placeholder: '+1-869 765 4321',
},
{
  icon: '🇱🇨',
  country: 'Saint Lucia',
  code: '+1-758',
  regex: /^(\+1-758)?\d{7}$/,
  format: makeFormatter([3, 4]),
  maxDigits: 7,
  placeholder: '+1-758 234 5678',
},
{
  icon: '🇻🇨',
  country: 'Saint Vincent and the Grenadines',
  code: '+1-784',
  regex: /^(\+1-784)?\d{7}$/,
  format: makeFormatter([3, 4]),
  maxDigits: 7,
  placeholder: '+1-784 456 7890',
},
{
  icon: '🇼🇸',
  country: 'Samoa',
  code: '+685',
  regex: /^(\+685)?[2-9]\d{4,6}$/,
  format: makeFormatter([2, 3, 2]), // handles both 5–7 digits
  maxDigits: 7,
  placeholder: '+685 72 12345',
},
{
  icon: '🇸🇲',
  country: 'San Marino',
  code: '+378',
  regex: /^(\+378)?6\d{7,9}$/,
  format: makeFormatter([2, 3, 3]),
  maxDigits: 9,
  placeholder: '+378 66 123 456',
},
{
  icon: '🇸🇹',
  country: 'São Tomé and Príncipe',
  code: '+239',
  regex: /^(\+239)?9\d{6}$/,
  format: makeFormatter([3, 4]),
  maxDigits: 7,
  placeholder: '+239 981 2345',
},
{
  icon: '🇸🇦',
  country: 'Saudi Arabia',
  code: '+966',
  regex: /^(\+966|0)?5\d{8}$/,
  format: makeFormatter([2, 3, 3]),
  maxDigits: 9,
  placeholder: '+966 50 123 4567',
},
{
  icon: '🇸🇳',
  country: 'Senegal',
  code: '+221',
  regex: /^(\+221)?7\d{8}$/,
  format: makeFormatter([2, 3, 3]),
  maxDigits: 9,
  placeholder: '+221 77 123 4567',
},
{
  icon: '🇷🇸',
  country: 'Serbia',
  code: '+381',
  regex: /^(\+381|0)?6\d{7,8}$/,
  format: makeFormatter([2, 3, 4]),
  maxDigits: 9,
  placeholder: '+381 64 123 4567',
},
{
  icon: '🇸🇨',
  country: 'Seychelles',
  code: '+248',
  regex: /^(\+248)?[259]\d{6}$/,
  format: makeFormatter([3, 4]),
  maxDigits: 7,
  placeholder: '+248 251 2345',
},
{
  icon: '🇸🇱',
  country: 'Sierra Leone',
  code: '+232',
  regex: /^(\+232)?(25|30|33|34|76|77|78|88)\d{6}$/,
  format: makeFormatter([2, 3, 3]),
  maxDigits: 8,
  placeholder: '+232 76 123 456',
},
{
  icon: '🇸🇬',
  country: 'Singapore',
  code: '+65',
  regex: /^(\+65)?[89]\d{7}$/,
  format: makeFormatter([4, 4]),
  maxDigits: 8,
  placeholder: '+65 9123 4567',
},
{
  icon: '🇸🇰',
  country: 'Slovakia',
  code: '+421',
  regex: /^(\+421|0)?9\d{8}$/,
  format: makeFormatter([3, 3, 3]),
  maxDigits: 9,
  placeholder: '+421 912 345 678',
},
{
  icon: '🇸🇮',
  country: 'Slovenia',
  code: '+386',
  regex: /^(\+386|0)?[37]\d{7}$/,
  format: makeFormatter([2, 3, 3]),
  maxDigits: 8,
  placeholder: '+386 31 234 567',
},
{
  icon: '🇸🇧',
  country: 'Solomon Islands',
  code: '+677',
  regex: /^(\+677)?(7|8)\d{6}$/,
  format: makeFormatter([3, 4]),
  maxDigits: 7,
  placeholder: '+677 741 2345',
},
{
  icon: '🇸🇴',
  country: 'Somalia',
  code: '+252',
  regex: /^(\+252)?6\d{7}$/,
  format: makeFormatter([2, 3, 3]),
  maxDigits: 8,
  placeholder: '+252 61 234 5678',
},
{
  icon: '🇿🇦',
  country: 'South Africa',
  code: '+27',
  regex: /^(\+27|0)?6\d{8}$/,
  format: makeFormatter([2, 3, 4]),
  maxDigits: 9,
  placeholder: '+27 61 234 5678',
},
{
  icon: '🇬🇸',
  country: 'South Georgia and the South Sandwich Islands',
  code: '+500',
  regex: /^(\+500)?\d{5}$/,
  format: makeFormatter([3, 2]),
  maxDigits: 5,
  placeholder: '+500 123 45',
},
{
  icon: '🇰🇷',
  country: 'South Korea',
  code: '+82',
  regex: /^(\+82|0)?1[0-9]\d{7,8}$/,
  format: makeFormatter([2, 4, 4]),
  maxDigits: 9,
  placeholder: '+82 10 1234 5678',
},
{
  icon: '🇸🇸',
  country: 'South Sudan',
  code: '+211',
  regex: /^(\+211)?9\d{8}$/,
  format: makeFormatter([2, 3, 3]),
  maxDigits: 9,
  placeholder: '+211 91 234 5678',
},
{
  icon: '🇪🇸',
  country: 'Spain',
  code: '+34',
  regex: /^(\+34)?6\d{8}$/,
  format: makeFormatter([3, 3, 3]),
  maxDigits: 9,
  placeholder: '+34 612 345 678',
},
{
  icon: '🇱🇰',
  country: 'Sri Lanka',
  code: '+94',
  regex: /^(\+94|0)?7\d{8}$/,
  format: makeFormatter([2, 3, 3]),
  maxDigits: 9,
  placeholder: '+94 71 234 5678',
},
{
  icon: '🇸🇩',
  country: 'Sudan',
  code: '+249',
  regex: /^(\+249)?9\d{8}$/,
  format: makeFormatter([2, 3, 3]),
  maxDigits: 9,
  placeholder: '+249 91 234 5678',
},
{
  icon: '🇸🇷',
  country: 'Suriname',
  code: '+597',
  regex: /^(\+597)?(7|8)\d{5}$/,
  format: makeFormatter([3, 3]),
  maxDigits: 6,
  placeholder: '+597 741 234',
},
{
  icon: '🇸🇯',
  country: 'Svalbard and Jan Mayen',
  code: '+47',
  regex: /^(\+47)?\d{8}$/,
  format: makeFormatter([3, 2, 3]),
  maxDigits: 8,
  placeholder: '+47 712 34 567',
},
{
  icon: '🇸🇿',
  country: 'Swaziland (Eswatini)',
  code: '+268',
  regex: /^(\+268)?7\d{7}$/,
  format: makeFormatter([3, 4]),
  maxDigits: 8,
  placeholder: '+268 761 2345',
},
{
  icon: '🇸🇪',
  country: 'Sweden',
  code: '+46',
  regex: /^(\+46|0)?7\d{8}$/,
  format: makeFormatter([2, 3, 3]),
  maxDigits: 9,
  placeholder: '+46 70 123 4567',
},
{
  icon: '🇨🇭',
  country: 'Switzerland',
  code: '+41',
  regex: /^(\+41|0)?7[5-9]\d{7}$/,
  format: makeFormatter([2, 3, 2, 2]),
  maxDigits: 9,
  placeholder: '+41 79 123 45 67',
},
{
  icon: '🇸🇾',
  country: 'Syria',
  code: '+963',
  regex: /^(\+963)?9\d{8}$/,
  format: makeFormatter([2, 3, 3]),
  maxDigits: 9,
  placeholder: '+963 93 123 4567',
},

  {
  icon: '🇹🇼',
  country: 'Taiwan',
  code: '+886',
  regex: /^(\+886|0)?9\d{8}$/,
  format: makeFormatter([3, 3, 3]), // 912 345 678
  placeholder: '+886 912 345 678',
  maxDigits: 9,
},
{
  icon: '🇹🇯',
  country: 'Tajikistan',
  code: '+992',
  regex: /^(\+992)?9\d{8}$/,
  format: makeFormatter([2, 3, 4]), // 92 123 4567
  placeholder: '+992 92 123 4567',
  maxDigits: 9,
},
{
  icon: '🇹🇿',
  country: 'Tanzania',
  code: '+255',
  regex: /^(\+255|0)?[67]\d{8}$/,
  format: makeFormatter([2, 3, 4]), // 65 123 4567
  placeholder: '+255 65 123 4567',
  maxDigits: 9,
},
{
  icon: '🇹🇭',
  country: 'Thailand',
  code: '+66',
  regex: /^(\+66|0)?[689]\d{8}$/,
  format: makeFormatter([2, 3, 4]), // 81 234 5678
  placeholder: '+66 81 234 5678',
  maxDigits: 9,
},
{
  icon: '🇹🇱',
  country: 'Timor-Leste',
  code: '+670',
  regex: /^(\+670)?7\d{7}$/,
  format: makeFormatter([3, 4]), // 772 3456
  placeholder: '+670 772 3456',
  maxDigits: 8,
},
{
  icon: '🇹🇬',
  country: 'Togo',
  code: '+228',
  regex: /^(\+228)?9\d{7}$/,
  format: makeFormatter([2, 3, 3]), // 90 123 456
  placeholder: '+228 90 123 456',
  maxDigits: 8,
},
{
  icon: '🇹🇰',
  country: 'Tokelau',
  code: '+690',
  regex: /^(\+690)?[27]\d{3}$/,
  format: makeFormatter([2, 2]), // 21 23
  placeholder: '+690 21 23',
  maxDigits: 4,
},
{
  icon: '🇹🇴',
  country: 'Tonga',
  code: '+676',
  regex: /^(\+676)?(7|8)\d{4}$/,
  format: makeFormatter([2, 3]), // 71 234
  placeholder: '+676 71 234',
  maxDigits: 5,
},
{
  icon: '🇹🇹',
  country: 'Trinidad and Tobago',
  code: '+1-868',
  regex: /^(\+1-868)?\d{7}$/,
  format: makeFormatter([3, 4]), // 291 1234
  placeholder: '+1-868 291 1234',
  maxDigits: 7,
},
{
  icon: '🇹🇳',
  country: 'Tunisia',
  code: '+216',
  regex: /^(\+216)?[2459]\d{7}$/,
  format: makeFormatter([2, 3, 3]), // 21 234 567
  placeholder: '+216 21 234 567',
  maxDigits: 8,
},
{
  icon: '🇹🇷',
  country: 'Turkey',
  code: '+90',
  regex: /^(\+90|0)?5\d{9}$/,
  format: makeFormatter([3, 3, 4]), // 530 123 4567
  placeholder: '+90 530 123 4567',
  maxDigits: 10,
},
{
  icon: '🇹🇲',
  country: 'Turkmenistan',
  code: '+993',
  regex: /^(\+993)?6\d{7}$/,
  format: makeFormatter([2, 2, 4]), // 65 12 3456
  placeholder: '+993 65 12 3456',
  maxDigits: 8,
},
{
  icon: '🇹🇨',
  country: 'Turks and Caicos Islands',
  code: '+1-649',
  regex: /^(\+1-649)?\d{7}$/,
  format: makeFormatter([3, 4]), // 231 1234
  placeholder: '+1-649 231 1234',
  maxDigits: 7,
},
{
  icon: '🇹🇻',
  country: 'Tuvalu',
  code: '+688',
  regex: /^(\+688)?2\d{4}$/,
  format: makeFormatter([2, 3]), // 20 123
  placeholder: '+688 20 123',
  maxDigits: 5,
},
{
  icon: '🇺🇬',
  country: 'Uganda',
  code: '+256',
  regex: /^(\+256|0)?7\d{8}$/,
  format: makeFormatter([2, 3, 4]), // 71 234 5678
  placeholder: '+256 71 234 5678',
  maxDigits: 9,
},
{
  icon: '🇺🇦',
  country: 'Ukraine',
  code: '+380',
  regex: /^(\+380|0)?\d{9}$/,
  format: makeFormatter([2, 3, 4]), // 67 123 4567
  placeholder: '+380 67 123 4567',
  maxDigits: 9,
},
{
  icon: '🇦🇪',
  country: 'United Arab Emirates',
  code: '+971',
  regex: /^(\+971)?5\d{8}$/,
  format: makeFormatter([2, 3, 4]), // 50 123 4567
  placeholder: '+971 50 123 4567',
  maxDigits: 9,
},
{
  icon: '🇬🇧',
  country: 'United Kingdom',
  code: '+44',
  regex: /^(\+44|0)?7\d{9}$/,
  format: makeFormatter([4, 6]), // 7123 456789
  placeholder: '+44 7123 456789',
  maxDigits: 10,
},
{
  icon: '🇺🇸',
  country: 'United States',
  code: '+1',
  regex: /^(\+1)?[2-9]\d{9}$/,
  format: makeFormatter([3, 3, 4]), // 415 555 2671
  placeholder: '+1 415 555 2671',
  maxDigits: 10,
},
{
  icon: '🇺🇲',
  country: 'United States Minor Outlying Islands',
  code: '+1',
  regex: /^(\+1)?[2-9]\d{9}$/,
  format: makeFormatter([3, 3, 4]), // 808 555 1234
  placeholder: '+1 808 555 1234',
  maxDigits: 10,
},
{
  icon: '🇺🇾',
  country: 'Uruguay',
  code: '+598',
  regex: /^(\+598)?9\d{7}$/,
  format: makeFormatter([3, 2, 2, 2]), // 991 23 45 67
  placeholder: '+598 991 23 45 67',
  maxDigits: 8,
},
{
  icon: '🇺🇿',
  country: 'Uzbekistan',
  code: '+998',
  regex: /^(\+998)?9\d{8}$/,
  format: makeFormatter([2, 3, 2, 2]), // 91 234 56 78
  placeholder: '+998 91 234 56 78',
  maxDigits: 9,
},

  {
  icon: '🇻🇺',
  country: 'Vanuatu',
  code: '+678',
  regex: /^(\+678)?[57]\d{6}$/,
  format: makeFormatter([3, 4]), // 591 2345
  placeholder: '+678 591 2345',
  maxDigits: 7,
},
{
  icon: '🇻🇦',
  country: 'Vatican City',
  code: '+379',
  regex: /^(\+379)?\d{6,8}$/,
  format: makeFormatter([3, 3, 2]), // 123 456 78
  placeholder: '+379 123 4567',
  maxDigits: 8,
},
{
  icon: '🇻🇪',
  country: 'Venezuela',
  code: '+58',
  regex: /^(\+58)?(2|4)\d{9}$/,
  format: makeFormatter([3, 3, 4]), // 212 123 4567
  placeholder: '+58 212 123 4567',
  maxDigits: 10,
},
{
  icon: '🇻🇳',
  country: 'Vietnam',
  code: '+84',
  regex: /^(\+84|0)?(3|5|7|8|9)\d{8}$/,
  format: makeFormatter([2, 3, 4]), // 91 234 5678
  placeholder: '+84 91 234 5678',
  maxDigits: 9,
},
{
  icon: '🇻🇬',
  country: 'Virgin Islands (British)',
  code: '+1-284',
  regex: /^(\+1-284)?\d{7}$/,
  format: makeFormatter([3, 4]), // 300 1234
  placeholder: '+1-284 300 1234',
  maxDigits: 7,
},
{
  icon: '🇻🇮',
  country: 'Virgin Islands (U.S.)',
  code: '+1-340',
  regex: /^(\+1-340)?\d{7}$/,
  format: makeFormatter([3, 4]), // 642 1234
  placeholder: '+1-340 642 1234',
  maxDigits: 7,
},
{
  icon: '🇼🇫',
  country: 'Wallis and Futuna',
  code: '+681',
  regex: /^(\+681)?8\d{5}$/,
  format: makeFormatter([2, 3]), // 82 3456
  placeholder: '+681 82 3456',
  maxDigits: 6,
},
{
  icon: '🇪🇭',
  country: 'Western Sahara',
  code: '+212',
  regex: /^(\+212)?6\d{8}$/,
  format: makeFormatter([2, 3, 3]), // 612 345 678
  placeholder: '+212 612 345 678',
  maxDigits: 9,
},
{
  icon: '🇾🇪',
  country: 'Yemen',
  code: '+967',
  regex: /^(\+967)?7\d{8}$/,
  format: makeFormatter([3, 3, 3]), // 733 123 456
  placeholder: '+967 733 123 456',
  maxDigits: 9,
},
{
  icon: '🇿🇲',
  country: 'Zambia',
  code: '+260',
  regex: /^(\+260|0)?9\d{8}$/,
  format: makeFormatter([3, 3, 3]), // 955 123 456
  placeholder: '+260 955 123 456',
  maxDigits: 9,
},
{
  icon: '🇿🇼',
  country: 'Zimbabwe',
  code: '+263',
  regex: /^(\+263|0)?7\d{8}$/,
  format: makeFormatter([2, 3, 4]), // 77 123 4567
  placeholder: '+263 77 123 4567',
  maxDigits: 9,
},
]

const InquireItem = ({ imgUrl, productName, productDesc, size, setInquireItem, inquire, hoverable }: ProdCard) => {
  const [step, nextStep] = useState(0);
  const [otp, setOtp] = useState<string>("".padEnd(6, " "));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countryCodeOptions, showCountryCodeOptions] = useState(false);
  const [countryCode, selectedCountryCode] = useState<Country>(countries[136]);
  const [countrySearch, setCountrySearch] = useState("");
  const [userInfo, storeUserInfo] = useState({
    name: '',
    contact: '',
    email: '',
    subject: `Product Inquiry: ${productName}`,
  });
  const [emailContent, setEmailContent] = useState(<>
        Hello <strong>OnTap Sales/Marketing Team</strong>,
        <br /><br />
        I hope this message finds you well. I am reaching out to inquire about the availability and details of your <strong>{productName} OnTap Card</strong> product. Could you kindly provide me with information regarding:
        <br /><br />
        <ul className="list-disc list-inside space-y-2 pl-3">
            <li>Pricing for different quantities</li>
            <li>Available sizes and material options</li>
            <li>Estimated production and delivery time</li>
        </ul>
        <br />
        If there are any design guidelines or minimum order requirements, I would also appreciate it if you could share those details.
        <br /><br />
        Thank you in advance for your assistance. I look forward to your reply.
        <br /><br />
        Best regards,
        <br />
        <strong className='capitalize'>{userInfo.name}</strong>
        <br />
        <a href={`tel:+${countryCode?.code}${userInfo.contact}`}>
            <strong>{userInfo.contact}</strong>
        </a>
        <br />
        <strong className='lowercase'>{userInfo.email}</strong>
    </>);
  const emailRef = useRef<HTMLDivElement | null>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

const getInputs = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;

  if (name === "contact") {
    let digits = value.replace(/\D/g, "");

    const countryDigits = countryCode.code.replace(/\D/g, "");
    if (digits.startsWith(countryDigits)) {
      digits = digits.slice(countryDigits.length);
    }

    if (countryCode.maxDigits) {
      if (digits.length > countryCode.maxDigits) {
        digits = digits.slice(0, countryCode.maxDigits);
      }
    }

    let formatted = digits;
    if (countryCode?.format) {
      try {
        formatted = countryCode.format(digits);
      } catch {
        formatted = digits;
      }
    }

    formatted = `${countryCode.code} ${formatted}`.trim();

    storeUserInfo((prev) => ({ ...prev, contact: formatted }));

    e.target.value = formatted;

    return;
  }

  // Default update for other fields
  storeUserInfo((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  const submitEmail = async () => {
    if (step === 0) {
        if (!userInfo.name || !userInfo.contact || !userInfo.email) {
            alert('Please fill out all required fields.');
        } else {
            try {
                const res = await fetch(`https://ontap-backend-system.vercel.app/api/email-verification`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        email: userInfo.email,
                        name: userInfo.name,
                    }),
                });

                const data = await res.json();

                if (data.success) {
                    alert('OTP sent successfully!');
                    nextStep(1);
                } else {
                    alert('Failed to send OTP: ' + data.message)
                }
            } catch (err) {
                console.log('Error sending OTP: ' + err);
            }
        }
    } else if (step === 1) {
        try {
            const res = await fetch(`https://ontap-backend-system.vercel.app/api/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userInfo.email,
                    otp: otp,
                }),
            });

            const data = await res.json();

            if (data.success) {
                <Toast icon='success' message='OTP matched.' />
                nextStep(2);
                setEmailContent(
                <>
                    Hello <strong>OnTap Sales/Marketing Team</strong>,
                    <br />
                    <br />
                    I hope this message finds you well. I am reaching out to inquire about the availability and details of your{' '}
                    <strong>{productName}</strong> product. Could you kindly provide me with information regarding:
                    <br />
                    <br />
                    <ul className="list-disc list-inside space-y-2 pl-3">
                    <li>Pricing for different quantities</li>
                    <li>Available sizes and material options</li>
                    <li>Estimated production and delivery time</li>
                    </ul>
                    <br />
                    If there are any design guidelines or minimum order requirements, I would also appreciate it if you could share those details.
                    <br />
                    <br />
                    Thank you in advance for your assistance. I look forward to your reply.
                    <br />
                    <br />
                    Best regards,
                    <br />
                    <strong className="capitalize">{userInfo.name}</strong>
                    <br />
                    <a href={`tel:${userInfo.contact.trim().replace(/\s+/g, "")}`}>{userInfo.contact}</a>
                    <br />
                    <strong className="lowercase">{userInfo.email}</strong>
                </>
                );
            } else { <Toast icon='error' message='OTP not matched.' />}
        } catch (err) { console.log(err) };
    } else {
        const messageHtml = emailRef.current?.innerHTML || '';

        const payload = {
            email: userInfo.email.toLowerCase(),
            name: userInfo.name.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
            subject: userInfo.subject,
            message: messageHtml,
            time: new Date().toLocaleString()
        };

        try {
        const res = await fetch(`https://ontap-backend-system.vercel.app/api/product-inquiry-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.success) {
            alert('Message sent successfully!');
            nextStep(0);
            storeUserInfo({
            name: '',
            contact: '',
            email: '',
            subject: `Product Inquiry: ${productName}`,
            });
            setOtp('');
        } else {
            <Toast icon='error' message={`Error: ${data.message}`} />
        }
        } catch (error) {
            console.error('Error sending email:', error);
            <Toast icon='error' message='Error sending email. Please try again.' />
        }
    }
    };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let value = e.target.value;

    // only keep one digit
    if (value.length > 1) {
      value = value.charAt(0);
    }

    // update OTP string
    const otpArray = otp.split("");
    otpArray[index] = value;
    const newOtp = otpArray.join("");
    setOtp(newOtp);

    // move focus to next input automatically
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleClick = (index: number) => {
    const otpArray = otp.split("");
    for (let i = index; i < otpArray.length; i++) {
      otpArray[i] = " ";
    }
    setOtp(otpArray.join(""));
  };

  const searchCountry = countries.filter((c) => 
    c.country.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div className='h-full w-full fixed top-0 left-0 bg-white/15 backdrop-blur-md z-100 flex items-center justify-center'>
        <div className='w-full h-full md:w-3/4 lg:w-1/2 md:h-2/3 rounded-xl bg-white shadow-md flex flex-col md:flex-row items-center p-3'>
            <button 
                type="button"
                className='md:hidden text-black/50 flex items-center gap-2 mr-auto rounded-md bg-light-blue/50 py-2 px-3 hover:text-black hover:bg-light-blue focus:text-white focus:bg-blue ease-out duration-200'
                onClick={() => setInquireItem(false)}
            ><HiOutlineArrowSmallLeft className='text-3xl'/></button>
            <ProductCard  
              imgUrl={imgUrl}
              productName={productName}
              productDesc={productDesc}
              size={size}
              setInquireItem={setInquireItem} 
              inquire={inquire}
              hoverable={hoverable}
            />
            <div className='h-full w-full md:w-3/5 flex flex-col items-end gap-5'>
                <span className='w-full flex justify-between items-start pt-5 md:pt-0'>
                    <span className='flex gap-3 items-center ml-3 md:ml-10 md:mt-3'>
                        <Image
                            alt='gmail icon'
                            height={500}
                            width={500}
                            src='/icons/gmaillogo.png'
                            className='w-6 md:w-8 aspect-square object-contain object-center'
                        />
                        <p className='font-semibold'>{step === 0 ? 'Leave Us a Message' : 'Account Verification'}</p>
                    </span>
                    <button 
                        type="button"
                        className='hidden md:block text-3xl text-neutral-400 rounded-full hover:bg-light-blue hover:text-rose-300 focus:bg-blue focus:text-rose-500 ease-out duration-200'
                        onClick={() => setInquireItem(false)}
                    ><HiOutlineXMark /></button>
                </span>
                <div className='h-full w-full px-2 md:px-10 flex flex-col gap-3 overflow-hidden md:mt-10'>
                    { step === 0 && (
                        <>
                            <span className='px-5 py-3 rounded-md border border-neutral-200'>
                                <input 
                                    name='name'
                                    type="text" 
                                    placeholder='Name'
                                    value={userInfo.name}
                                    onChange={getInputs}
                                    className='h-full w-full outline-none capitalize'
                                />
                            </span>
                            <span className='px-5 pl-0 rounded-md border border-neutral-200 flex gap-3'>
                                <div className='relative flex gap-2 items-center'>
                                    <button 
                                        type="button"
                                        className='h-full w-full bg-light-blue/50 py-3 px-3 pr-2 flex items-center gap-1 rounded-l-sm group hover:bg-light-blue/70 focus:bg-light-blue ease-out duration-200'
                                        onClick={ () => {showCountryCodeOptions(!countryCodeOptions); storeUserInfo((prev) => ({...prev, contact: ''}))} }
                                    >
                                        <span>{countryCode?.icon}</span>
                                        <span className='font-extrabold ml-2'>{countryCode?.code}</span>
                                        <TbCaretDownFilled className='text-neutral-400 group-hover:text-neutral-600 group-focus:text-black'/>
                                    </button>
                                    { countryCodeOptions && (
                                        <div className='absolute h-auto max-h-50 w-auto z-50 rounded-md bg-white top-full mt-1 overflow-x-hidden border border-black/20 shadow-md'>
                                            <input 
                                                type="text" 
                                                className='sticky top-0 p-2 bg-white border-b border-neutral-200 hover:border-b-2 hover:border-blue/50 focus:border-b-2 focus:border-blue outline-none ease-out duration-200'
                                                value={countrySearch}
                                                placeholder={countryCode?.icon + '  ' + countryCode?.country}
                                                onChange={(e) => setCountrySearch(e.target.value)}
                                            />
                                            {searchCountry.map((value, i) => (
                                                <button 
                                                    key={i} 
                                                    type="button" 
                                                    className='text-black p-2 w-full max-w-47 overflow-hidden flex items-center gap-3 justify-between hover:bg-light-blue/50 focus:bg-light-blue ease-out duration-200'
                                                    onClick={() => {
                                                        selectedCountryCode(value);
                                                        showCountryCodeOptions(false);
                                                        setCountrySearch("");
                                                    }}
                                                >
                                                    <span>{value.icon}</span>
                                                    <span className='text-nowrap overflow-ellipsis overflow-hidden mr-auto'>{value.country}</span> 
                                                    <strong className='text-nowrap text-sm'>{value.code}</strong>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <input 
                                    name='contact'
                                    type="text" 
                                    placeholder={countryCode?.placeholder}
                                    value={userInfo.contact}
                                    onChange={(e) => getInputs(e)}
                                    className='h-full w-full outline-none'
                                />
                            </span>
                            <span className='px-5 py-3 rounded-md border border-neutral-200'>
                                <input 
                                    name='email'
                                    type="email" 
                                    placeholder='Email Address'
                                    value={userInfo.email}
                                    onChange={getInputs}
                                    className='h-full w-full outline-none lowercase placeholder:capitalize'
                                />
                            </span>
                        </>
                    )}
                    { step === 1 && (
                        <>
                            <p>We sent a One-Time Code to your email  <strong>{userInfo.email}</strong>. Please check and input the OTP Key below.</p>
                            <span className='mt-auto grid grid-cols-6 gap-3 px-14'>
                                {[...Array(6)].map((_, index) => (
                                    <input
                                    key={index}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={otp[index] === " " ? "" : otp[index] ?? ""}
                                    className="p-3 border border-gray-400 rounded-md text-center text-3xl text-dark-blue font-bold focus:outline-blue ease-out duration-200"
                                    ref={(el) => {
                                        inputRefs.current[index] = el;
                                    }}
                                    onChange={(e) => handleInput(e, index)}
                                    onClick={() => handleClick(index)}
                                    />
                                ))}
                            </span>
                        </>
                    )}
                    { step === 2 && (
                        <>
                            <span className='px-5 py-3 rounded-md border border-neutral-200'>
                                <input 
                                    name='subject'
                                    type="text" 
                                    placeholder='Subject'
                                    value={userInfo.subject}
                                    onChange={getInputs}
                                    className='h-full w-full outline-none'
                                />
                            </span>
                            <div
                                ref={emailRef}
                                contentEditable
                                suppressContentEditableWarning
                                className="overflow-x-hidden px-5 py-3 rounded-md border border-neutral-200 outline-none min-h-[200px] whitespace-pre-wrap"
                            >
                                {emailContent}
                            </div>
                        </>
                    )}
                    <span className='w-full flex justify-end gap-2 mt-5'>
                        { step > 0 && (
                            <button 
                                type="button"
                                className='flex gap-2 px-4 py-2 rounded-md border border-neutral-400 text-neutral-400 items-center hover:border-neutral-700 hover:text-neutral-600 focus:border-black focus:text-black ease-out duration-200'
                                onClick={() => { step === 2 ? nextStep(1) : nextStep(0)}}
                            >Back</button>
                        )}
                        <button 
                            type="button" 
                            className='flex gap-2 px-4 py-2 rounded-md bg-light-blue items-center hover:bg-blue focus:bg-dark-blue focus:text-white ease-out duration-200'
                            onClick={submitEmail}
                        >Next<HiOutlineArrowLongRight /></button>
                    </span>
                    <span className='w-full grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mt-auto md:mb-5'>
                        <p className='col-span-full font-semibold'>You can also reach out via </p>
                        <a
                            href='tel:+0270072412'                            
                            className='col-span-1 flex gap-2 items-center hover:underline focus:underline ease-out duration-200 text-nowrap'
                        ><HiPhone className='text-xl md:text-2xl text-dark-blue'/>(02) 7007-2412</a>
                        <a
                            href='tel:+639286935815'                            
                            className='col-span-1 flex gap-2 items-center hover:underline focus:underline ease-out duration-200 text-nowrap'
                        ><HiPhone className='text-xl md:text-2xl text-dark-blue'/>+63 928 693 5815</a>
                        <a
                            href='tel:+639772473179'                            
                            className='col-span-1 flex gap-2 items-center hover:underline focus:underline ease-out duration-200 text-nowrap'
                        ><HiPhone className='text-xl md:text-2xl text-dark-blue'/>+63 977 247 3179</a>
                        <a 
                            href="https://www.google.com/maps/place/17+Vatican+City+Dr,+Las+Pi%C3%B1as" 
                            target="_blank"
                            className='col-span-full flex -ml-0.5 gap-2 md:items-center hover:underline focus:underline ease-out duration-200'
                        >
                            <HiLocationMarker className='text-3xl text-rose-700'/>
                            17 Vatican City Dr, BF Resort Village, Talon 2, Las Piñas City
                        </a>
                    </span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default InquireItem