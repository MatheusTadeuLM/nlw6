import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { UsersRepositories } from "../repositories/UsersRepositories"
import { hash } from 'bcryptjs';

interface IUserRequest {
  name: string;
  email:string;
  admin?: boolean;
  password: string;
}

class CreateUserService{
  async execute({ name, email, admin = false, password } : IUserRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    if(!email){
      throw new AppError("Email incorrect");
    }

    const userAlreadyExist = await usersRepositories.findOne({
      email
    });

    if(userAlreadyExist) {
      throw new AppError("User already exists");
    }

    const passwordHash = await hash(password, 8);

    const user = usersRepositories.create({
      name,
      email,
      admin,
      password: passwordHash
    });

    await usersRepositories.save(user);

    return user;
  }
}

export { CreateUserService }