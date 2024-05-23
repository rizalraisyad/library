## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
Tsc 5.3.3
Node 20.11.1

## Installation

```bash
$ yarn install
```

## Pre Running
Make sure database and .env.development ready
## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```

# Backend Test Case

## Entities

- Member
- Book

## Use Case Features

- Members can borrow books with conditions
    - Members may not borrow more than 2 books
    - Borrowed books are not borrowed by other members
    - Member is currently not being penalized
- Member returns the book with conditions
    - The returned book is a book that the member has borrowed
    - If the book is returned after more than 7 days, the member will be subject to a penalty. Member with penalty cannot able to borrow the book for 3 days
- Check the book
    - Shows all existing books and quantities
    - Books that are being borrowed are not counted
- Member check
    - Shows all existing members
    - The number of books being borrowed by each member

## Example post body
Doc on ```/api``` after start
Book Body Example
```
{
    "data": {
        "type": "CreateBookDto",
        "attributes": {
            "title": "test",
            "author": "asdsssss",
            "code": "dddd",
            "stock": 2
        }
    }
}
```

member body example
```
{
    "data": {
        "type": "CreateMemberDto",
        "attributes": {
            "name": "test",
            "code": "aassd"
        }
    }
}
```

Borrowing body example
```
{
    "data": {
        "type": "CreateBorrowingDto",
        "attributes": {
            "memberId": "737906c0-d93d-4df8-824b-ca277260896d",
            "bookId": "b0f6ffbf-7a62-4363-b173-c53580c42f71"
        }
    }
}
```
*wrap yout type and attribute into object of data
## Requirements

- Using NestJS
- Swagger as API Documentation
- Using Postgresql (you can run the docker)
