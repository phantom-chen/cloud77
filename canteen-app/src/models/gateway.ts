export class GatewayService {

    public static getTokenFromLicenseBackend(): void {
        fetch('LicenseBackend/token', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
                'Authorization': 'Bearer xxx',
                'Accept': 'application/json',

            },
            method: "POST",
            body: 'grant_type=password&username=hexact_client&password=Ab_123456!'
        }).then(response => response.json())
            .then(json => {
                console.log(json['access_token']);
            })
    }
}
