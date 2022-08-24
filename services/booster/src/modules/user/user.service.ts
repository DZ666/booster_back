import { Injectable } from "@nestjs/common";
import { UserRepository } from "./repository/user.repository";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async getUserData(selected) {
    // return await this.userRepository.findUserByEmail()
  }
}
