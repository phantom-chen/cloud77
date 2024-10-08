import Consul from "consul"
import { networkInterfaces } from "os";
import { v4 as uuid } from "uuid";

export function getIPV4(): string {
    let address = "";
    const interfaces = networkInterfaces();

    const infos = interfaces.eth0;
    if (infos) {
        address = infos[0].address;
    }
    
    return address;
}

export async function registerService(
    consul: Consul.Consul,
    service: {
        name: string,
        ip: string,
        port: number,
        tags: string[],
        healthCheck: string
    }): Promise<void> {

    await consul.agent.service.register({
        id: uuid(),
        name: service.name,
        address: service.ip,
        port: service.port,
        tags: service.tags,
        timeout: 5000,
        check: {
            http: service.healthCheck,
            interval: '10s'
        }
    }).catch(err => {
        console.log(err)
    })
}

export async function getConsulServices(
    consul: Consul.Consul
) {
    await consul.agent.service.list({ dc: 'data-center-hz'}).then((value: any) => {
        Object.entries(value as object).forEach((val, res) => {
            console.log(val[1])
        })
    })
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

export async function hasHealthService(
    consul: Consul.Consul,
    service: string,
    status: string): Promise<string | undefined> {
    const items = await consul.health.checks(service).then((value: any) => {
        const checks = value as any[];
        if (checks.length === 0) {
            return
        }

        const check = checks[0] as any;
        if (check['Status'] === status) {
            return String(check['ServiceID'])
        } else {
            return
        }
    });
    return items;
}

let connected = true;
let connectingError = "";

export async function useConsul(
    consul: Consul.Consul,
    service: {
        name: string,
        address: string,
        port: number,
        tags: string[],
        healthCheck: string
    }
) {
    setInterval(async() => {
        try {
            let serviceID = await hasHealthService(consul, service.name, 'critical')
            if (serviceID) {
                deregisterService(consul, serviceID);
            } else{
                serviceID = await hasHealthService(consul, service.name, 'passing')
                
                if (!serviceID) {
                    registerService(consul, {
                        name: service.name,
                        ip: service.address,
                        port: service.port,
                        tags: service.tags,
                        healthCheck: service.healthCheck
                    })
                }
            }
        } catch (error) {
            if (connected) {
                connected = false;
                connectingError = "fail to connect consul";
                console.log(connectingError);
            }

        }
    }, 5000)    
}