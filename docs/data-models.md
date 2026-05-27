# Data Models

## Account
An account of the website

An account can be a person or represent an organization, or business, or community group, etc

An account has a list of "traits"
An account has a list of "connections" organized into "connection groups"
An account can login and see and manage their "traits" and "connections" and "connection groups"

The `publicListed` field controls whether the account appears in search results (`searchAccounts`). Accounts created via BetterAuth OAuth flow.

```
{
    "id": "",
    "displayName": string,
    "username": string,
    "publicListed": boolean,
    "traits":[],
    "connections":[],
    "connectionGroups":[]
}
```



## Trait
A custom key value pair on an account.
This is a generic type to represent different ways accounts can contact or follow another account.

The `visibleGroups` field is a cached view of which connection groups can see this trait.
The `category` and `icon` fields are optional.


```
{
    "id": "",
    "account":"",
    "key":"",
    "value":"",
    "category":"",
    "icon":"",
    "visibleGroups":[]
}
```

### Trait category

A trait can be one of many categories including PHONE_NUMBER, EMAIL, SOCIAL_MEDIA_LINK, WEBSITE_LINK, and platform-specific categories like FACEBOOK, INSTAGRAM, LINKEDIN, YOUTUBE, GITHUB, SPOTIFY, and more. See the Prisma schema for the full list.

The category determines the default icon of the trait.


## Connection

A connection is a link an account creates with another account 
When an account requests to connect with another account, each account gets a connection entry.
Each account assigns their connection entry one or more groups.
Trait visibility is controlled through connection groups — traits are shared with connections based on group membership (`trait.visibleGroups`).
These are one sided, only the account that owns the connection can see the data in it.

The `status` field is one of: PENDING, ACCEPTED, DECLINED.
The `createdAt` field is the timestamp when the connection was created.

```
{
    "id": "",
    "account":"",
    "connectedAccount":"",
    "status": "",
    "groups":[],
    "createdAt": ""
}
```

## Connection Group

A connection group allows accounts to assign their connections to a group and control what traits are visible to any connected account in the group.
Trait visibility lives on the connection group. 
There is a cached view of the groups and connections on a trait when they user views their accounts own ( `trait.visibleGroups`)

```
{
    "id": "",
    "account":"",
    "name":"",
    "connections": [],
    "traits":[]
}
```

