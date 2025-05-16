# API Response

```json
{
 'code': '123',
 'message': 'xxx',
 'id': 'xxx'
 'timestamp': 'xxx',
}
```

## Codes

- invalid-account
- invalid-password
- existing-user-entity
- invalid-token
- invalid-account
- empty-refresh-token
- valid-logout-code
- invalid-logout-code
- logout-code-removed
- password-reset-email-sent
- verification-email-sent
- user-entity-created
- update-database-error
- user-email-verified
- user-password-updated

## Examples

```json
{
"version": "1.0.0",
"hostname": "localhost",
"machine":"xxx",
"environment": "development",
"apikey": "xxx",
"home":"xxx",
"user":"xxx",
"product":"xxx"
}
```

```json
{
"index":0,
"size":0,
"total":0,
"query":"xxx",
"data":[
{"id":"","name":"","title":"","region":"","address":"","createdAt":"","updatedAt":""}
]
}
```

```json
{
"index":0,
"size":0,
"total":0,
"query":"xxx",
"data":[
{"id":"","collection":"","tags":"","title":"","href":""}
]
}
```

```json
{
"data":[
{"email":"","name":"","role":""}
]
}
```

```json
{
"email":"xxx",
"name":"xxx",
"role":"xxx",
"profile": {
"surname":"xxx"
}
}
```

```json
{"email":"xxx",data:{"surname":"xxx"}}
```

```json
{
"email":"xxx",
"index":0,
"size":0,
"total":0,
"query":"xxx",
"data":[{"id":"","title":"","description":"","state":0}]
}
```

```json
{
"email":"xxx",
"index":0,
"size":0,
"total":0,
"query":"xxx",
"data":[{"id":"","title":"","description":""}]
}
```

```json
{
"index":0,
"size":0,
"total":0,
"query":"xxx",
"data":[
"xxx/xxx/xxx.txt"
]
}
```
