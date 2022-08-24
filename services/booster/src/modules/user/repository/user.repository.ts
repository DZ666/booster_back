import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { from, Observable } from "rxjs";
import IUser from "../interfaces/user";
import { User, UserDocument } from "../schemas/user.schema";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Finding one user by parametes
   * @param {params} params
   * @example { email: String } | { password: String } | { name: String }
   * @returns {User} founded by parametes
   */
  private findOne(params, select = ""): Observable<any> {
    return from(this.userModel.findOne(params).select(select).exec());
  }

  /**
   * Creating new user document
   * @param {params} params is all params which you want to save in user document
   * @example params: { name: "Some name", email: "someemail@gmail.com", password: "123456" }
   * @returns {UserDocument} user document
   */
  public save(params: IUser): Observable<IUser> {
    return from(this.userModel.create(params));
  }

  /**
   *
   * @param email search parameter
   * @param select fields which you need to take or remove ("-" in front of any word)
   * @example select: "email -password"
   * @returns { UserDocument } { email: "email@gmail.com" }
   * @returns { UserDocument } returns user data like { _id: Types.ObjectId, email: String, password: String, name: String }
   */
  public findUserByEmail(email: string, select = ""): Observable<UserDocument> {
    return from(this.findOne({ email }, select));
  }
}
