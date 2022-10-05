import { objectSchemaSimple } from '@/helpers/validator';

// for user registration requests
export interface RegisterUserInfo {
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export function registerUserInfoToJson(userInfo: RegisterUserInfo) {
  return {
    userName: userInfo.username,
    email: userInfo.email,
    password: userInfo.password,
    phoneNumber: userInfo.phoneNumber ?? '',
  };
}

// for response handling
export interface RegisterSuccess {
  id: string; // userId
}

export const isRegisterSuccess = objectSchemaSimple<RegisterSuccess>({
  id: 'string',
});

// errors that might be yielded from an unsuccessively registration
export interface IdentityError {
  code: IdentityErrorCode;
  description: string;
}

// https://github.com/dotnet/aspnetcore/blob/05b2afb73b55b11d8cb3691dedfebba1f0285332/src/Identity/Extensions.Core/src/IdentityErrorDescriber.cs
export enum IdentityErrorCode {
  DefaultError = 'DefaultError',
  ConcurrencyFailure = 'ConcurrencyFailure',
  PasswordMismatch = 'PasswordMismatch',
  InvalidToken = 'InvalidToken',
  RecoveryCodeRedemptionFailed = 'RecoveryCodeRedemptionFailed',
  LoginAlreadyAssociated = 'LoginAlreadyAssociated',
  InvalidUserName = 'InvalidUserName',
  InvalidEmail = 'InvalidEmail',
  DuplicateUserName = 'DuplicateUserName',
  DuplicateEmail = 'DuplicateEmail',
  InvalidRoleName = 'InvalidRoleName',
  DuplicateRoleName = 'DuplicateRoleName',
  UserAlreadyHasPassword = 'UserAlreadyHasPassword',
  UserLockoutNotEnabled = 'UserLockoutNotEnabled',
  UserAlreadyInRole = 'UserAlreadyInRole',
  UserNotInRole = 'UserNotInRole',
  PasswordTooShort = 'PasswordTooShort',
  PasswordRequiresUniqueChars = 'PasswordRequiresUniqueChars',
  PasswordRequiresNonAlphanumeric = 'PasswordRequiresNonAlphanumeric',
  PasswordRequiresDigit = 'PasswordRequiresDigit',
  PasswordRequiresLower = 'PasswordRequiresLower',
  PasswordRequiresUpper = 'PasswordRequiresUpper',
}
