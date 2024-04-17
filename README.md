<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="125" height="125" alt="Nest Logo" /></a>
</p>

## Description

Realword is project similar to medium with a lot of real world feature like scenarios.
This is done to demonstrate the use of Nestjs framework when building REST API

## Features

### Authentication

```
POST /api/users/login
```

Request body

```
{
  "user":{
    "email": "jake@jake.jake",
    "password": "jakejake"
  }
}
```

### Registration

```
POST /api/users
```

Request body

```
{
  "user":{
    "username": "Jacob",
    "email": "jake@jake.jake",
    "password": "jakejake"
  }
}
```

### Get Current User

### Update User

### Get Profile

### Follow user

### Unfollow User
