# Guide

vscode/launch.json

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "msedge",
            "request": "launch",
            "runtimeArgs": [
                "--inprivate",
                "--start-maximized",
                "--auto-open-devtools-for-tabs"
            ],
            "name": "Launch Edge against localhost",
            "url": "http://localhost:4200",
            "webRoot": "${workspaceFolder}"
        }
    ]
}
```

C:\Users\xxx\Documents
LocalApplicationData          C:\Users\xxx\AppData\Local
UserProfile                   C:\Users\xxx
