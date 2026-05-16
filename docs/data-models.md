# Data Models

## Account
An account of the website

An account can be a person or represent an organization, or business, or community group, etc

An account has a list of "traits"
An account has a list of "connections" organized into "connection groups"
An account can login and see and manage their "traits" and "connections" and "connection groups"

```
{
    "id": "",
    "displayName": string,
    "publicListed": boolean,
    "traits":[],
    "connections":[]
}
```



## Trait
A custom key value pair on an account.
This is a generic type to represent different ways accounts can contact or follow another account.


```
[
    "account":"",
    "key":"",
    "value:"",
    "category":"",
    "icon":""
]
```

### Trait category

A trait can be one of the following:
- phone number
- email
- social media link
- website link

The category determines the default icon of the trait.


## Connection

A connection is a link an account creates with another account 
When an account requests to connect with another account, each account gets a connection entry.
Each account assigns their connection entry one or more groups.
The account can also add individual traits of theirs to a connection. This allows the connected account to see the data in that trait.
These are one sided, only the account that owns the connection can see the data in it.

```
{
    "account":"",
    "connectedAccount":"",
    "groups":[]
    "traits":[]
}
```

## Connection Group

A connection group allows accounts to assign their connections to a group and control what traits are visible to any connected account in the group.

```
{
    "account":"",
    "name":"",
    "connections": [],
    "traits":[]
}
```

