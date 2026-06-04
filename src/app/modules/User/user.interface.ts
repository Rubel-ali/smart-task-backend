import { UserRole, UserStatus } from "@prisma/client";

export interface IUser {
  id?: string;
  email: string;
  username: string;
  fullName: string;
  phoneNumber?: string;
  location?: string;
  password: string;
  role: UserRole;
  profession: string;
  promoCode: string;
  status: UserStatus;
  isResticted: boolean;
  isNotification: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}


export type IUserFilterRequest = {
  fullName?: string | undefined;
  email?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
}