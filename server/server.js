const PORT = process.env.PORT ?? 8000;
const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, position } = req.body;

  try {
    const existingUser = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const signUp = await pool.query(
      `INSERT INTO users (name, email, password, position) VALUES($1, $2, $3, $4)`,
      [`${firstName} ${lastName}`, email, hashedPassword, position]
    );

    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

    res.json({ email, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (!user.rows.length) {
      return res.status(404).json({ detail: "User does not exist!" });
    }

    const isBlocked = user.rows[0].status === "blocked";

    if (isBlocked) {
      return res.status(401).json({
        detail: "User is blocked.",
      });
    }

    const success = await bcrypt.compare(password, user.rows[0].password);

    if (success) {
      await pool.query("UPDATE users SET last_login = $1 WHERE id = $2", [
        new Date(),
        user.rows[0].id,
      ]);

      const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

      res.json({ email: user.rows[0].email, token, user });
    } else {
      res.status(401).json({ detail: "Incorrect password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.json(users);
  } catch (error) {
    console.error(error);
  }
});

app.get("/current-user", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "secret");
    const userEmail = decodedToken.email;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      userEmail,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/delete/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/block/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    await pool.query("UPDATE users SET status = 'blocked' WHERE id = $1", [
      userId,
    ]);
    res.status(200).send("User blocked successfully");
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/unblock/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    await pool.query("UPDATE users SET status = 'active' WHERE id = $1", [
      userId,
    ]);
    res.status(200).send("User blocked successfully");
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
