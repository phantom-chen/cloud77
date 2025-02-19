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
                "--auto-open-devtools-for-tabs"
            ],
            "name": "Launch Edge against localhost",
            "url": "http://localhost:4200",
            "webRoot": "${workspaceFolder}"
        }
    ]
}
```