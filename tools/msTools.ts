import { HttpException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, EMPTY } from "rxjs";

export function fail(message: string, status: number) {
  throw new RpcException({ custom: true, message, status });
}

export async function sendMessageFromMs(
  channel: ClientProxy,
  name: string,
  data: any = "",
) {
  try {
    return await new Promise((resolve, reject) =>
      channel
        .send(name, data)
        .pipe(
          catchError(err => {
            reject(err);
            return EMPTY;
          }),
        )
        .subscribe(resolve),
    );
  } catch (err) {
    if (err.custom) {
      fail(err.message, err.status);
    } else {
      throw err;
    }
  }
}

export async function emitMessageFromMs(
  channel: ClientProxy,
  name: string,
  data: any = "",
) {
  try {
    return await new Promise((resolve, reject) =>
      channel
        .emit(name, data)
        .pipe(
          catchError(err => {
            reject(err);
            return EMPTY;
          }),
        )
        .subscribe(resolve),
    );
  } catch (err) {
    if (err.custom) {
      fail(err.message, err.status);
    } else {
      throw err;
    }
  }
}

export async function sendMessage(
  channel: ClientProxy,
  name: string,
  data: any = "",
) {
  try {
    return await new Promise((resolve, reject) =>
      channel
        .send(name, data)
        .pipe(
          catchError(err => {
            reject(err);
            return EMPTY;
          }),
        )
        .subscribe(resolve),
    );
  } catch (err) {
    if (err.custom) {
      throw new HttpException(err.message, err.status);
    } else {
      throw err;
    }
  }
}

export async function emitMessage(
  channel: ClientProxy,
  name: string,
  data: any = "",
) {
  try {
    return await new Promise((resolve, reject) =>
      channel
        .emit(name, data)
        .pipe(
          catchError(err => {
            reject(err);
            return EMPTY;
          }),
        )
        .subscribe(resolve),
    );
  } catch (err) {
    if (err.custom) {
      throw new HttpException(err.message, err.status);
    } else {
      throw err;
    }
  }
}
