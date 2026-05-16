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

## Wireframes

### / - Landing Page

- Hero section with app description
- Call-to-action buttons: Login / Sign up
- Search bar for finding public accounts (`searchAccounts`)

### /login - Login Page

- OAuth provider buttons (social login via BetterAuth)
- Redirect to `/login/create-account` for new users

### /login/create-account - Create Account Page

- Display name input
- Username input
- `publicListed` toggle (controls search visibility)
- Continue/Submit button

### /edit/traits - Traits Page

- List of existing traits showing: key, value, category, icon, visible groups
- Create trait form: key input, value input, category dropdown (`PHONE_NUMBER`, `EMAIL`, `SOCIAL_MEDIA_LINK`, `WEBSITE_LINK`), optional icon input
- Edit trait button per row (opens inline edit or modal)
- Delete trait button per row (with confirmation)
- Visible groups controls per trait: checkboxes/toggles for each connection group to control `visibleGroups`

### /edit/groups - Groups Page

- List of existing connection groups showing: name, connection count, trait count
- Create group form: name input
- Rename group button per row
- Delete group button per row (with confirmation)
- Add connection to group: connection selector + group selector
- Remove connection from group button

### /settings - Settings Page

- Display name edit field
- Username edit field
- `publicListed` toggle
- OAuth provider management: list of connected providers with link/unlink buttons

### /link - Connections Inbox

- Pending connections section: list showing connected account, createdAt, Accept/Decline buttons
- All connections section: list showing connected account, status, assigned groups (user's own groups only)
- Remove connection button per row
- Add connection to group controls per connection

### /link/{username} - User Page

- Account profile display: displayName, username, visible traits (filtered by `visibleGroups` if connected)
- If not connected: "Request Connection" button
- If already connected: show shared traits (determined by `visibleGroups` on each trait), connection status, remove connection button

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

A user views another account's profile page via username or share link. Trait visibility is determined by connection status and group membership.

## Review Traits Shared with a Connection

A user checks what traits they are currently sharing with a specific connection.

## Update Traits Shared with a Connection

A user adds or removes traits they share with an existing connection.

## Search for Users

A user searches the platform to find other accounts to connect with.

## View Connection Details

A user views the details of a specific connection including group assignments and shared traits.
