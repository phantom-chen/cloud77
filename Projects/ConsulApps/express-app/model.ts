import Consul from "consul";
import { networkInterfaces } from "os";

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function getIPAddress(): string {
  let address = "";
  const interfaces = networkInterfaces();

  const infos = interfaces.eth0;
  if (infos) {
    address = infos[0].address;
  }

  return address;
}

export async function getServices(consul: Consul.Consul) {
    await consul.agent.service.list({ dc: 'dc1'}).then((value: any) => {
        Object.entries(value as object).forEach((val, res) => {
            console.log(val[1])
        })
    })
}

export async function registerService(
  consul: Consul.Consul,
  name: string,
  version: string,
  tags: string[],
  port: number
): Promise<void> {
  await consul.agent.service
    .register({
      id: generateId(),
      name,
      tags,
      port,
      meta: {
        version
      },
      check: {
        http: `http://${getIPAddress()}:${port}/health`,
        interval: "10s"
      },
      timeout: 5000
    })
    .then(() => {})
    .catch((err) => {
      throw err;
    });
}

export async function deregisterService(
    consul: Consul.Consul,
    id: string) {
    await consul.agent.service.deregister(id)
    .then(() => console.log(`service ${id} is deregistered at consul`))
    .catch(err => {
    console.log(`service ${id} is not found at consul`);
});
}