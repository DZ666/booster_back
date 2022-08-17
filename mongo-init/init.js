db.createUser({
  user: "booster",
  pwd: "WtfIsThisPassword",
  roles: [
    {
      role: "readWrite",
      db: "BOOSTER",
    },
  ],
});
