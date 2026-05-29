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

A trait category classifies the type of contact information or link. The 7 categories are:

| Category | Purpose | Examples |
|---|---|---|
| `CONTACT_INFO` | Direct contact methods | Email, phone number |
| `MAILING_ADDRESS` | Physical/mail address | Street address, PO box |
| `SOCIAL_LINK` | Social media profiles | Facebook, Instagram, YouTube, Reddit, Bluesky |
| `PROFESSIONAL_LINK` | Professional/academic/dev profiles | LinkedIn, GitHub, GitLab |
| `WEBSITE_LINK` | General websites | Blog, portfolio, storefront |
| `MESSAGING_HANDLE` | Chat/messaging identifiers | Discord tag, Telegram username, WhatsApp |
| `OTHER` | Anything else | Spotify, Twitch, PayPal, Zoom |

The category determines the default icon. Users can override the icon per-trait using the `icon` field, which supports platform-specific icons (Facebook, Instagram, Spotify, etc.) as well as generic icons.


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

