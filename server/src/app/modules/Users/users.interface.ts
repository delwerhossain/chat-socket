import { Types } from 'mongoose';

// Address Interface
export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

// Login Details Interface
export interface ILoginDetails {
  timestamp?: Date;
  ip?: string;
}

// Communication Preferences Interface
export interface ICommunicationPreferences {
  email: boolean;
  sms: boolean;
  pushNotifications: boolean;
}

// User Profile Interface
export interface IUserProfile {
  name: string;
  phoneNumber: string;
  avatarUrl?: string;
  shippingAddress?: IAddress;
  billingAddress?: IAddress;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
}

// Vendor Profile Interface
export interface IVendorProfile {
  businessName: string;
  avatarUrl?: string;
  description?: string;
  ratings?: {
    averageRating: number;
    reviewCount: number;
  };
  businessCategoryID?: Types.ObjectId;
  websiteUrl?: string;
  socialMediaLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  taxId?: string;
  contactInfo?: {
    contactEmail?: string;
    contactPhone?: string;
    contactAddress?: IAddress;
  };
}

// User Interface
export interface IUser {
  email: string;
  emailVerified?: boolean;
  passwordHash: string;
  role: 'user' | 'vendor';
  isDelete?: boolean;
  isActive?: boolean;
  lastLogin?: ILoginDetails;
  profile?: IUserProfile | IVendorProfile; // Conditional profile based on role
  communicationPreferences?: ICommunicationPreferences;
}
