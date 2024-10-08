import { homedir, hostname, type } from 'os';
import { getIPV4, useConsul } from './utility/consul';
import Consul from 'consul';
import { randomUUID } from 'crypto';
import { generate } from 'randomstring';
import * as dotenv from 'dotenv';
import { createAppServer } from './servers/simple';
import { runChatServer } from './servers/online';
import { getVersion } from './servers/utility';
import { consumeMessages } from './servers/consumer';
import { getSetting } from './models/settings';
import { ensureFolders } from './controllers/health';

dotenv.config();
const PORT = process.env.PORT || '80';

function beforeStartApp(): void {
    process.argv.forEach((val, index) => {
        console.log(`${index}: ${val}`);
    });
    console.log(__dirname);
    console.log(__filename);
    console.log(type());
    console.log(homedir());
    console.log(randomUUID());        
    console.log(generate(7));
}

if (process.env.CHATAPP && process.env.CHATAPP === 'true') {
    console.log(`Express server is listening at ${PORT}`);
    runChatServer(Number(PORT));

} else {
    createAppServer({
        port: PORT
    }).then(server => {
        console.log(`Express server is listening at ${PORT}`);
        server.listen(PORT, async () => {
            beforeStartApp();
            ensureFolders();
            await consumeMessages();
    
            const setting = getSetting();
            const ver = await getVersion();
            const tags = setting.tags.split(',');
            tags.push(`v${ver}`);
            tags.push(hostname());
            
            const serviceRegister = false
            if (serviceRegister) {
                const consul = new Consul({
                    host: 'consulhost',
                    port: '8500',
                    secure: false,
                    promisify: true
                })
                const address = type() === 'Linux' ? getIPV4() : hostname();    
                useConsul(consul, {
                    name: setting.service,
                    address,
                    port: Number(PORT),
                    tags,
                    healthCheck: `http://${address}/api/health`
                })
            }
        });
    });
}
