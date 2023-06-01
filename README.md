# Docker settings

Download image
```
- docker pull postgres
```

Start a postgres instance
``` 
- docker run --name architects-system -e POSTGRES_USER=localuser -e POSTGRES_PASSWORD=userpass -e POSTGRES_DB=database -p 5432:5432 -d postgres
``` 

# Test's
## To test only spec file:

```
- yarn run test:watch -t src/users/test/users.service.spec.ts
```