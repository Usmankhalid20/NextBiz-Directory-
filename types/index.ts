export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  hasDataAccess: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IBusiness {
  _id: string;
  placeId: string;
  businessName: string;
  description?: string;
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  website?: string;
  category?: string;
  rating: number;
  reviewCount: number;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  isOpenNow: boolean;
  images: string[];
  tags: string[];
  createdBy: string | IUser; // ID or populated user
  lastModifiedBy?: string | IUser;
  createdAt: Date | string;
  updatedAt: Date | string;
  isDeleted?: boolean; // Soft delete
}

export interface IApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}

export interface IAuthContext {
  user: IUser | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<IApiResponse>;
  signup: (data: { name: string; email: string; password: string }) => Promise<IApiResponse>;
  logout: () => Promise<void>;
}
