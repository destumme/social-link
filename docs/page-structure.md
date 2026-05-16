# UI Page Structure

Nouns inside double quotes refer to a data model 
See `./data-models` for their definition.

```
/ - Landing Page
/login - Login Page, allows an "account" to login via social oauth
/login/create-account 

/edit/traits - traits page, allows an "account" to create, update, and delete their "traits"
/edit/groups - group page, allows an "account" to create, update, delete "connection" groups and assign "trait" visibility to groups
/settings - account settings page, allows an "account" to change their account settings and manage their OAuth Social Login connections

/link - Connections inbox, shows pending requests and all connections
/link/{username} - User page (public view or connection-specific view showing shared traits)
```

# User Scenarios

## Create Account

A new user registers and creates their account profile.

## Add/Remove OAuth Login on Account

A user links or unlinks social OAuth providers to their account.

## Create Group

A user creates a new connection group to organize their connections.

## Rename Group

A user changes the name of an existing connection group.

## Delete Group

A user removes a connection group they no longer need.

## Add Account to Group

A user assigns an existing connection to one or more groups.

## Remove Account from Group

A user removes a connection from a specific group.

## Create Trait

A user adds a new key-value pair (like email or social link) to their profile.

## Delete Trait

A user removes a trait from their profile.

## Edit Trait

A user modifies the key, value, or category of an existing trait.

## Toggle Group Visibility on Trait

A user controls which connection groups can see a specific trait.

## Request Connection

A user sends a connection request to another account.

## Remove Connection

A user deletes an existing connection with another account.

## Accept Connection

A user approves an incoming connection request.

## Decline Connection

A user rejects an incoming connection request.

## View Pending Connection Requests

A user reviews incoming and outgoing pending connection requests.

## View Connected User Page

A user views another connected user's profile and the traits they've shared.

## Review Traits Shared with a Connection

A user checks what traits they are currently sharing with a specific connection.

## Update Traits Shared with a Connection

A user adds or removes traits they share with an existing connection.

## Search for Users

A user searches the platform to find other accounts to connect with.

## View Connection Details

A user views the details of a specific connection including group assignments and shared traits.
