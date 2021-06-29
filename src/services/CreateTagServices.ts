import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { TagsRepositories } from "../repositories/TagsRepositories"

class CreateTagServices{
  async execute(name: string ) {
    const tagsRepositories = getCustomRepository(TagsRepositories);

    if(!name){
      throw new AppError("Name incorrect");
    }

    const tagAlreadyExist = await tagsRepositories.findOne({
      name
    });

    if(tagAlreadyExist) {
      throw new AppError("Tag already exists");
    }

    const tag = tagsRepositories.create({
      name,
    });

    await tagsRepositories.save(tag);

    return tag;
  }
}

export { CreateTagServices }