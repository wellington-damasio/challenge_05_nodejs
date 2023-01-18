import { getRepository, Repository } from "typeorm";

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from "../../dtos";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({ user_id }: IFindUserWithGamesDTO) {
    return await this.repository
      .createQueryBuilder("user")
      .where("user.id = :id", { id: user_id })
      .leftJoinAndSelect("user.games", "game")
      .getOne();
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return await this.repository.query(
      "SELECT * FROM users ORDER BY first_name ASC"
    );
  }

  async findUserByFullName({ first_name, last_name }: IFindUserByFullNameDTO) {
    return await this.repository.query(
      `SELECT * FROM users WHERE LOWER(first_name) = LOWER('${first_name}') AND LOWER(last_name) = LOWER('${last_name}')`
    );
  }
}
