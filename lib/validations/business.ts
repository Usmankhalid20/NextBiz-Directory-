import { z } from 'zod';

export const businessSchema = z.object({
  businessName: z.string().min(1, 'Business Name is required'),
  placeId: z.string().min(1, 'Place ID is required'),
  description: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  category: z.string().optional(),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().min(0).default(0),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]),
  }).optional(),
  isOpenNow: z.boolean().default(false),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export type BusinessInput = z.infer<typeof businessSchema>;
