import { Request, Response } from "express";
import axios from "axios";

export async function getGitHubUser(req: Request, res: Response) {
  const user = req.query["username"];
  const data = await axios.get(`https://api.github.com/users/${user}`);

  if (data.data) {
    res.json(data.data);
  } else {
    res.status(404).json({
      code: "empty-github-user",
      id: "",
      message: "not found",
    });
  }
}
