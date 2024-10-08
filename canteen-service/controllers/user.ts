import axios from "axios";

export async function getGithubUser(name:string) {
    const data = await axios.get(`https://api.github.com/users/${name}`);
    return data.data
}