import { GatewayService } from '@phantom-chen/cloud77';
import axios from 'axios';

export async function getGatewayKey(host: string) {
    const { data, status } = await axios.get<GatewayService>(`${host}/api/service/apps`, { headers: { Accept: 'application/json' } });
    console.log(status);
    console.log(data);

    await axios.get(`${host}/user-app/service`, { headers: { Accept: 'application/json', "x-api-key": data.apikey } }).then(d => {
        console.log(d.data);
    });
}

getGatewayKey("https://www.cloud77.top")