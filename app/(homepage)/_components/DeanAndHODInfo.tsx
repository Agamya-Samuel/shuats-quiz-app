import { Mail, Phone, Map } from 'lucide-react';
import Image from 'next/image';
import { deanImage, hodImage, DileepImage, nkGuptaImage } from '@/public/images/index.js';

const profiles = [
  {
    name: 'Prof. (Dr.) Ashok Tripathi',
    title: 'Dean of Department of Computer Science & Information Technology',
    address: 'SHUATS, Naini, Prayagraj (Formerly Allahabad) -211007\nU.P. (INDIA)',
    phone: '+91-532-2684394',
    fax: 'Fax: +91-532-2684394',
    email: 'deanviaet@shuats.edu.in',
    img: deanImage,
    color: 'green',
  },
  {
    name: 'Dr. Wilson Jeberson',
    title: 'Head of Department of Computer Science & Information Technology',
    address: 'SHUATS, Naini, Prayagraj (Formerly Allahabad) -211007\nU.P. (INDIA)',
    phone: '+919452248375',
    email: 'jeberson_w@shuats.edu.in',
    img: hodImage,
    color: 'green',
  },
  {
    name: 'Er. Dileep Kumar',
    title: 'Assistant Professor (Sel. Grade)',
    address: 'SHUATS, Naini, Prayagraj (Formerly Allahabad) -211007\nU.P. (INDIA)',
    phone: '+919935620054',
    email: 'dileep.kumar@shuats.edu.in',
    img: DileepImage,
    color: 'blue',
  },
  {
    name: 'Dr. N. K. Gupta',
    title: 'Assistant Professor (Sel. Grade)',
    address: 'SHUATS, Naini, Prayagraj (Formerly Allahabad) -211007\nU.P. (INDIA)',
    phone: '+919335101824',
    email: 'narendra.gupta@shuats.edu.in',
    img: nkGuptaImage,
    color: 'purple',
  },
];

export default function DeanAndHODInfo() {
  return null;
} 