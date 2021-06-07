export const join = (req, res) => res.send("Join");
export const edit = (req, res) => res.send("Edit");

export const login = (req, res) => res.send("Login");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => {
  console.log(req.params);
  res.send("See User");
};
export const deleteUser = (req, res) => res.send("Delete User");
