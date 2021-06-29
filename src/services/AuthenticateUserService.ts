import { getCustomRepository } from "typeorm"

import { compare } from "bcryptjs";
import { sign } from 'jsonwebtoken';

import { AppError } from "../errors/AppError";
import { UsersRepositories } from "../repositories/UsersRepositories"

interface IAuthenticateRequest {
  email: string;
  password: string;
}

class AuthenticateUserService {

  async execute({email, password}: IAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    const user = await usersRepositories.findOne({
      email
    });

    if(!user) {
      throw new AppError("Email/Password incorrect");
    }

    const passwordMatch =  await compare(password, user.password);

    if(!passwordMatch) {
      throw new AppError("Email/Password incorrect");
    }

    const token = sign({
      email: user.email
    }, "90c8c95bf14ff516c268abe35b21acc8", {
      subject: user.id,
      expiresIn: "1d"
    });

    return token;
  }
}

export { AuthenticateUserService }