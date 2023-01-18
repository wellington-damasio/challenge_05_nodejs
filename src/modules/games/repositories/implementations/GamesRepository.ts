import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string) {
    return await this.repository
      .createQueryBuilder("game")
      .where("game.title ILIKE :param", { param: `%${param}%` })
      .getMany();
  }

  async countAllGames() {
    return await this.repository.query("SELECT COUNT(*) FROM games;");
  }

  async findUsersByGameId(id: string) {
    const game = await this.repository.findOne({
      where: { id },
    });
    return await this.repository
      .createQueryBuilder("games")
      .relation(Game, "users")
      .of(game)
      .loadMany();
  }
}
