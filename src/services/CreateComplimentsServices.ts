import { getCustomRepository } from "typeorm"
import { User } from "../entities/User";
import { AppError } from "../errors/AppError";
import { ComplimentsRepositories } from "../repositories/ComplimentsRepositories"
import { UsersRepositories } from "../repositories/UsersRepositories";

interface IComplimentRequest {
  tag_id: string;
  user_sender: string;
  user_receiver: string;
  message: string;
}

class CreateComplimentsServices{
  async execute({tag_id, user_sender, user_receiver, message}: IComplimentRequest) {
    const complimentsRepository = getCustomRepository(ComplimentsRepositories);
    const usersRepository = getCustomRepository(UsersRepositories);

    if(user_sender === user_receiver) {
      throw new AppError("Incorrect User Receiver");
    }

    const userReceiverExist = await usersRepository.findOne(user_receiver);

    if(!userReceiverExist){
      throw new AppError("User Receiver does not exists");
    }

    const compliment = complimentsRepository.create({
      tag_id,
      user_sender,
      user_receiver,
      message
    })

    await complimentsRepository.save(compliment);

    return compliment;
  }
}

export { CreateComplimentsServices }