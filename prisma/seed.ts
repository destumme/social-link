import { prisma } from "@/lib/database/prisma";
import { auth } from "@/lib/auth";
import { TraitCategory, ConnectionStatus } from "@/generated/prisma/client";

interface UserData {
  email: string;
  password: string;
  name: string;
  username: string;
  publicListed: boolean;
}

interface TraitData {
  key: string;
  value: string;
  category: TraitCategory;
}

async function getOrCreateUser(data: UserData): Promise<{ id: string }> {
  let existingUser: { id: string } | null = null;

  try {
    const result = await auth.api.listUsers({
      query: {
        filterField: "username",
        filterValue: data.username,
        filterOperator: "eq",
      },
    });
    if (result.users.length > 0) {
      existingUser = result.users[0];
    }
  } catch {
    const found = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (found) existingUser = found;
  }

  if (existingUser) return existingUser;

  const created = await auth.api.createUser({
    body: {
      email: data.email,
      password: data.password,
      name: data.name,
      data: {
        username: data.username,
        publicListed: data.publicListed,
      },
    },
  });
  return created.user;
}

async function getOrCreateTrait(accountId: string, data: TraitData) {
  const existing = await prisma.trait.findFirst({
    where: { accountId, key: data.key, value: data.value },
  });
  if (existing) return existing;

  return await prisma.trait.create({
    data: {
      key: data.key,
      value: data.value,
      category: data.category,
      accountId,
    },
  });
}

async function getOrCreateGroup(
  accountId: string,
  name: string,
  traitIds: string[] = [],
) {
  const existing = await prisma.connectionGroup.findFirst({
    where: { accountId, name },
  });
  if (existing) return existing;

  return await prisma.connectionGroup.create({
    data: {
      name,
      accountId,
      traits: { connect: traitIds.map((id) => ({ id })) },
    },
  });
}

async function getOrCreateConnection(
  accountId: string,
  connectedAccountId: string,
  status: ConnectionStatus,
  groupIds: string[] = [],
) {
  const existing = await prisma.connection.findFirst({
    where: { accountId, connectedAccountId },
  });
  if (existing) return existing;

  return await prisma.connection.create({
    data: {
      accountId,
      connectedAccountId,
      status,
      connectionGroups: {
        connect: groupIds.map((id) => ({ id })),
      },
    },
  });
}

async function main() {
  const userDefs: UserData[] = [
    {
      email: "test+alice@example.com",
      password: "alice123",
      name: "Alice Smith",
      username: "alice",
      publicListed: false,
    },
    {
      email: "test+bob@example.com",
      password: "bob12345",
      name: "Bob Jones",
      username: "bob",
      publicListed: false,
    },
    {
      email: "test+charlie@example.com",
      password: "charlie1",
      name: "Charlie Brown",
      username: "charlie",
      publicListed: false,
    },
    {
      email: "test+diana@example.com",
      password: "diana123",
      name: "Diana Prince",
      username: "diana",
      publicListed: false,
    },
    {
      email: "test+eve@example.com",
      password: "eve12345",
      name: "Eve Wilson",
      username: "eve",
      publicListed: true,
    },
    {
      email: "test+frank@example.com",
      password: "frank123",
      name: "Frank Miller",
      username: "frank",
      publicListed: true,
    },
    {
      email: "test+grace@example.com",
      password: "grace123",
      name: "Grace Lee",
      username: "grace",
      publicListed: true,
    },
    {
      email: "test+henry@example.com",
      password: "henry123",
      name: "Henry Adams",
      username: "henry",
      publicListed: false,
    },
    {
      email: "test+iris@example.com",
      password: "iris1234",
      name: "Iris Chen",
      username: "iris",
      publicListed: true,
    },
    {
      email: "test+jack@example.com",
      password: "jack1234",
      name: "Jack Turner",
      username: "jack",
      publicListed: false,
    },
  ];

  const users = {} as Record<string, { id: string }>;
  for (const def of userDefs) {
    const user = await getOrCreateUser(def);
    users[def.username] = user;
  }

  const alice = users.alice;
  const bob = users.bob;
  const charlie = users.charlie;
  const diana = users.diana;
  const eve = users.eve;
  const frank = users.frank;
  const grace = users.grace;
  const henry = users.henry;
  const iris = users.iris;
  const jack = users.jack;

  // Alice traits
  const aliceEmail = await getOrCreateTrait(alice.id, {
    key: "email",
    value: "alice@example.com",
    category: "CONTACT_INFO",
  });
  const alicePhone = await getOrCreateTrait(alice.id, {
    key: "phone",
    value: "+1234567890",
    category: "CONTACT_INFO",
  });
  await getOrCreateTrait(alice.id, {
    key: "linkedin",
    value: "https://linkedin.com/in/alice",
    category: "PROFESSIONAL_LINK",
  });
  await getOrCreateTrait(alice.id, {
    key: "instagram",
    value: "https://instagram.com/alice",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(alice.id, {
    key: "discord",
    value: "alice#1234",
    category: "MESSAGING_HANDLE",
  });

  // Bob traits
  const bobTwitter = await getOrCreateTrait(bob.id, {
    key: "twitter",
    value: "https://twitter.com/bob",
    category: "SOCIAL_LINK",
  });
  const bobWebsite = await getOrCreateTrait(bob.id, {
    key: "website",
    value: "https://bob.dev",
    category: "WEBSITE_LINK",
  });
  await getOrCreateTrait(bob.id, {
    key: "linkedin",
    value: "https://linkedin.com/in/bob",
    category: "PROFESSIONAL_LINK",
  });
  await getOrCreateTrait(bob.id, {
    key: "spotify",
    value: "https://open.spotify.com/user/bob",
    category: "OTHER",
  });
  await getOrCreateTrait(bob.id, {
    key: "twitch",
    value: "https://twitch.tv/bob",
    category: "OTHER",
  });

  // Charlie traits
  const charlieEmail = await getOrCreateTrait(charlie.id, {
    key: "email",
    value: "charlie@example.com",
    category: "CONTACT_INFO",
  });
  const charlieGithub = await getOrCreateTrait(charlie.id, {
    key: "github",
    value: "https://github.com/charlie",
    category: "PROFESSIONAL_LINK",
  });
  await getOrCreateTrait(charlie.id, {
    key: "linkedin",
    value: "https://linkedin.com/in/charlie",
    category: "PROFESSIONAL_LINK",
  });
  await getOrCreateTrait(charlie.id, {
    key: "telegram",
    value: "https://t.me/charlie",
    category: "MESSAGING_HANDLE",
  });
  await getOrCreateTrait(charlie.id, {
    key: "bluesky",
    value: "https://bsky.app/profile/charlie",
    category: "SOCIAL_LINK",
  });

  // Diana traits
  const dianaPhone = await getOrCreateTrait(diana.id, {
    key: "phone",
    value: "+0987654321",
    category: "CONTACT_INFO",
  });
  const dianaWebsite = await getOrCreateTrait(diana.id, {
    key: "website",
    value: "https://diana.dev",
    category: "WEBSITE_LINK",
  });
  await getOrCreateTrait(diana.id, {
    key: "instagram",
    value: "https://instagram.com/diana",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(diana.id, {
    key: "youtube",
    value: "https://youtube.com/@diana",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(diana.id, {
    key: "whatsapp",
    value: "+0987654321",
    category: "MESSAGING_HANDLE",
  });

  // Eve traits
  const eveEmail = await getOrCreateTrait(eve.id, {
    key: "email",
    value: "eve@example.com",
    category: "CONTACT_INFO",
  });
  const eveTwitter = await getOrCreateTrait(eve.id, {
    key: "twitter",
    value: "https://twitter.com/eve",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(eve.id, {
    key: "instagram",
    value: "https://instagram.com/eve",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(eve.id, {
    key: "github",
    value: "https://github.com/eve",
    category: "PROFESSIONAL_LINK",
  });
  await getOrCreateTrait(eve.id, {
    key: "reddit",
    value: "https://reddit.com/user/eve",
    category: "SOCIAL_LINK",
  });

  // Frank traits
  await getOrCreateTrait(frank.id, {
    key: "email",
    value: "frank@example.com",
    category: "CONTACT_INFO",
  });
  await getOrCreateTrait(frank.id, {
    key: "linkedin",
    value: "https://linkedin.com/in/frank",
    category: "PROFESSIONAL_LINK",
  });
  await getOrCreateTrait(frank.id, {
    key: "twitch",
    value: "https://twitch.tv/frank",
    category: "OTHER",
  });
  await getOrCreateTrait(frank.id, {
    key: "spotify",
    value: "https://open.spotify.com/user/frank",
    category: "OTHER",
  });
  await getOrCreateTrait(frank.id, {
    key: "discord",
    value: "frank#5678",
    category: "MESSAGING_HANDLE",
  });

  // Grace traits
  await getOrCreateTrait(grace.id, {
    key: "email",
    value: "grace@example.com",
    category: "CONTACT_INFO",
  });
  await getOrCreateTrait(grace.id, {
    key: "phone",
    value: "+1122334455",
    category: "CONTACT_INFO",
  });
  await getOrCreateTrait(grace.id, {
    key: "instagram",
    value: "https://instagram.com/grace",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(grace.id, {
    key: "youtube",
    value: "https://youtube.com/@grace",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(grace.id, {
    key: "bluesky",
    value: "https://bsky.app/profile/grace",
    category: "SOCIAL_LINK",
  });

  // Henry traits
  await getOrCreateTrait(henry.id, {
    key: "email",
    value: "henry@example.com",
    category: "CONTACT_INFO",
  });
  await getOrCreateTrait(henry.id, {
    key: "phone",
    value: "+5566778899",
    category: "CONTACT_INFO",
  });
  await getOrCreateTrait(henry.id, {
    key: "github",
    value: "https://github.com/henry",
    category: "PROFESSIONAL_LINK",
  });
  await getOrCreateTrait(henry.id, {
    key: "telegram",
    value: "https://t.me/henry",
    category: "MESSAGING_HANDLE",
  });
  await getOrCreateTrait(henry.id, {
    key: "reddit",
    value: "https://reddit.com/user/henry",
    category: "SOCIAL_LINK",
  });

  // Iris traits
  await getOrCreateTrait(iris.id, {
    key: "email",
    value: "iris@example.com",
    category: "CONTACT_INFO",
  });
  await getOrCreateTrait(iris.id, {
    key: "linkedin",
    value: "https://linkedin.com/in/iris",
    category: "PROFESSIONAL_LINK",
  });
  await getOrCreateTrait(iris.id, {
    key: "instagram",
    value: "https://instagram.com/iris",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(iris.id, {
    key: "whatsapp",
    value: "+1231231234",
    category: "MESSAGING_HANDLE",
  });
  await getOrCreateTrait(iris.id, {
    key: "threads",
    value: "https://threads.net/@iris",
    category: "SOCIAL_LINK",
  });

  // Jack traits
  await getOrCreateTrait(jack.id, {
    key: "email",
    value: "jack@example.com",
    category: "CONTACT_INFO",
  });
  await getOrCreateTrait(jack.id, {
    key: "phone",
    value: "+9998887776",
    category: "CONTACT_INFO",
  });
  await getOrCreateTrait(jack.id, {
    key: "twitter",
    value: "https://twitter.com/jack",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(jack.id, {
    key: "github",
    value: "https://github.com/jack",
    category: "PROFESSIONAL_LINK",
  });
  await getOrCreateTrait(jack.id, {
    key: "spotify",
    value: "https://open.spotify.com/user/jack",
    category: "OTHER",
  });

  // Connection groups (1-2 per user)
  const aliceCloseFriends = await getOrCreateGroup(alice.id, "Close Friends", [
    aliceEmail.id,
    alicePhone.id,
  ]);
  const aliceProfessional = await getOrCreateGroup(alice.id, "Professional");

  const bobColleagues = await getOrCreateGroup(bob.id, "Colleagues", [
    bobTwitter.id,
    bobWebsite.id,
  ]);
  const bobSocial = await getOrCreateGroup(bob.id, "Social");

  const charlieDevContacts = await getOrCreateGroup(
    charlie.id,
    "Dev Contacts",
    [charlieEmail.id, charlieGithub.id],
  );

  const dianaSocial = await getOrCreateGroup(diana.id, "Social", [
    dianaPhone.id,
    dianaWebsite.id,
  ]);

  const eveNetworks = await getOrCreateGroup(eve.id, "Networks", [
    eveEmail.id,
    eveTwitter.id,
  ]);
  const eveCloseFriends = await getOrCreateGroup(eve.id, "Close Friends");

  const frankDevContacts = await getOrCreateGroup(frank.id, "Dev Contacts");
  const frankMusic = await getOrCreateGroup(frank.id, "Music");

  const graceSocial = await getOrCreateGroup(grace.id, "Social");
  const graceCreative = await getOrCreateGroup(grace.id, "Creative");

  const henryDevContacts = await getOrCreateGroup(henry.id, "Dev Contacts");
  const henryFriends = await getOrCreateGroup(henry.id, "Friends");

  const irisSocial = await getOrCreateGroup(iris.id, "Social");
  const irisMessaging = await getOrCreateGroup(iris.id, "Messaging");

  const jackDevContacts = await getOrCreateGroup(jack.id, "Dev Contacts");
  const jackMusic = await getOrCreateGroup(jack.id, "Music");

  // Connections (30 directional)
  // Alice
  await getOrCreateConnection(alice.id, bob.id, ConnectionStatus.ACCEPTED, [
    aliceCloseFriends.id,
  ]);
  await getOrCreateConnection(alice.id, charlie.id, ConnectionStatus.ACCEPTED);
  await getOrCreateConnection(alice.id, eve.id, ConnectionStatus.ACCEPTED, [
    aliceProfessional.id,
  ]);

  // Bob
  await getOrCreateConnection(bob.id, alice.id, ConnectionStatus.ACCEPTED, [
    bobColleagues.id,
  ]);
  await getOrCreateConnection(bob.id, charlie.id, ConnectionStatus.ACCEPTED, [
    bobColleagues.id,
  ]);
  await getOrCreateConnection(bob.id, diana.id, ConnectionStatus.ACCEPTED, [
    bobSocial.id,
  ]);

  // Charlie
  await getOrCreateConnection(charlie.id, alice.id, ConnectionStatus.ACCEPTED);
  await getOrCreateConnection(charlie.id, bob.id, ConnectionStatus.ACCEPTED);
  await getOrCreateConnection(charlie.id, grace.id, ConnectionStatus.ACCEPTED, [
    charlieDevContacts.id,
  ]);

  // Diana
  await getOrCreateConnection(diana.id, bob.id, ConnectionStatus.ACCEPTED);
  await getOrCreateConnection(diana.id, eve.id, ConnectionStatus.ACCEPTED, [
    dianaSocial.id,
  ]);
  await getOrCreateConnection(diana.id, frank.id, ConnectionStatus.ACCEPTED);

  // Eve
  await getOrCreateConnection(eve.id, alice.id, ConnectionStatus.ACCEPTED, [
    eveNetworks.id,
  ]);
  await getOrCreateConnection(eve.id, diana.id, ConnectionStatus.ACCEPTED, [
    eveCloseFriends.id,
  ]);
  await getOrCreateConnection(eve.id, iris.id, ConnectionStatus.ACCEPTED);

  // Frank
  await getOrCreateConnection(frank.id, diana.id, ConnectionStatus.ACCEPTED);
  await getOrCreateConnection(frank.id, grace.id, ConnectionStatus.ACCEPTED, [
    frankMusic.id,
  ]);
  await getOrCreateConnection(frank.id, henry.id, ConnectionStatus.ACCEPTED, [
    frankDevContacts.id,
  ]);

  // Grace
  await getOrCreateConnection(grace.id, charlie.id, ConnectionStatus.ACCEPTED, [
    graceSocial.id,
  ]);
  await getOrCreateConnection(grace.id, frank.id, ConnectionStatus.ACCEPTED, [
    graceCreative.id,
  ]);
  await getOrCreateConnection(grace.id, iris.id, ConnectionStatus.ACCEPTED);

  // Henry
  await getOrCreateConnection(henry.id, frank.id, ConnectionStatus.ACCEPTED, [
    henryDevContacts.id,
  ]);
  await getOrCreateConnection(henry.id, iris.id, ConnectionStatus.ACCEPTED, [
    henryFriends.id,
  ]);
  await getOrCreateConnection(henry.id, jack.id, ConnectionStatus.ACCEPTED);

  // Iris
  await getOrCreateConnection(iris.id, eve.id, ConnectionStatus.ACCEPTED, [
    irisSocial.id,
  ]);
  await getOrCreateConnection(iris.id, grace.id, ConnectionStatus.ACCEPTED, [
    irisMessaging.id,
  ]);
  await getOrCreateConnection(iris.id, henry.id, ConnectionStatus.ACCEPTED);
  await getOrCreateConnection(iris.id, jack.id, ConnectionStatus.ACCEPTED, [
    irisSocial.id,
  ]);

  // Jack
  await getOrCreateConnection(jack.id, henry.id, ConnectionStatus.ACCEPTED, [
    jackMusic.id,
  ]);
  await getOrCreateConnection(jack.id, iris.id, ConnectionStatus.ACCEPTED, [
    jackDevContacts.id,
  ]);

  console.log("Seeded some users, connections, traits, and connection groups");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
