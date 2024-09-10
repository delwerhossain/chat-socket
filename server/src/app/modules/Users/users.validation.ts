import mongoose from 'mongoose';
import { z } from 'zod';

// Shared Address Schema
const AddressSchema = z.object({
  street: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),
  country: z.string().trim().optional(),
});

// Shared LastLogin Schema
const LastLoginSchema = z.object({
  timestamp: z.date().optional(),
  ip: z.string().optional(),
});

// Shared Communication Preferences Schema
const CommunicationPreferencesSchema = z.object({
  email: z.boolean().default(true),
  sms: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
});

// User Profile Schema
const UserProfileSchema = z.object({
  name: z.string().trim().optional(),
  phoneNumber: z.string().trim().optional(),
  avatarUrl: z.string().trim().optional(),
  shippingAddress: AddressSchema.optional(),
  billingAddress: AddressSchema.optional(),
  dateOfBirth: z.date().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

// Vendor Profile Schema
const VendorProfileSchema = z.object({
  businessName: z.string().trim(),
  avatarUrl: z.string().trim().optional(),
  description: z.string().trim().optional(),
  ratings: z
    .object({
      averageRating: z.number().default(0),
      reviewCount: z.number().default(0),
    })
    .optional(),
  businessCategoryID: z
    .string()
    .refine(val => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid business Category ID',
    }),
  websiteUrl: z.string().trim().optional(),
  socialMediaLinks: z
    .object({
      facebook: z.string().trim().optional(),
      twitter: z.string().trim().optional(),
      instagram: z.string().trim().optional(),
    })
    .optional(),
  taxId: z.string().trim().optional(),
  contactInfo: z
    .object({
      contactEmail: z.string().trim().optional(),
      contactPhone: z.string().trim().optional(),
      contactAddress: AddressSchema.optional(),
    })
    .optional(),
});

// Base User Schema
const BaseUserSchema = z.object({
  email: z.string().email().trim(),
  emailVerified: z.boolean().default(false),
  passwordHash: z.string().trim(),
  role: z.enum(['user', 'vendor']).default('user'),
  isDelete: z.boolean().default(false),
  isActive: z.boolean().default(true),
  lastLogin: LastLoginSchema.optional(),
  profile: z.union([UserProfileSchema, VendorProfileSchema]).optional(),
  communicationPreferences: CommunicationPreferencesSchema.optional(),
});

// Conditional Validation Schema
const UserValidationSchema = BaseUserSchema.refine(
  data => {
    // Allow profile to be optional, but validate it if present
    if (data.role === 'vendor') {
      if (
        data.profile &&
        !VendorProfileSchema.safeParse(data.profile).success
      ) {
        return false;
      }
    } else {
      if (data.profile && !UserProfileSchema.safeParse(data.profile).success) {
        return false;
      }
    }
    return true;
  },
  {
    message: 'Profile data is invalid for the given role',
    path: ['profile'],
  },
);

// Partial Update Schemas (before refine)
const userUpdateValidation = BaseUserSchema.partial();
const vendorUpdateValidation = BaseUserSchema.partial();

// Exported Validation Objects
const userValidation = UserValidationSchema;
const vendorValidation = UserValidationSchema;

export const UserValidation = {
  userValidation,
  userUpdateValidation,
  vendorValidation,
  vendorUpdateValidation,
};
