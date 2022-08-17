import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { from, Observable } from "rxjs";
import IUser from "src/modules/user/interfaces/user";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJwt(user: IUser): Observable<string> {
    return from(this.jwtService.signAsync({ user }));
  }

  hashPassword(pwd: string): Observable<string> {
    return from<string>(bcrypt.hash(pwd, 12));
  }

  comparePwds(pwd: string, storedPwdHash: string): Observable<any> {
    return from(bcrypt.compare(pwd, storedPwdHash));
  }
}
