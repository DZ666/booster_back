import { Connection } from "mongoose";

export async function checkPermissions(permission, user, conn: Connection) {
  if (user.role === "user") {
    if (permission) {
      return false;
    }
    return null;
  }
  const permissions = await conn
    .collection("admin")
    .findOne(
      { _id: "roleModel" },
      {
        projection: {
          _id: false,
          [user.role]: true,
        },
      },
    )
    .then(async res => {
      if (res) {
        return await res[user.role];
      }
      return await res;
    });

  if (permission) {
    try {
      const [route, perm] = permission.split(".");
      return permissions[route][perm] ? await permissions : false;
    } catch {
      return false;
    }
  } else {
    return (await permissions) || null;
  }
}
