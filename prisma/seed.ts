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
  initiatorId: string,
  recipientId: string,
  status: ConnectionStatus,
  initiatorGroupIds: string[] = [],
  recipientGroupIds: string[] = [],
) {
  const existing = await prisma.connection.findFirst({
    where: {
      OR: [
        { initiatorId, recipientId },
        { initiatorId: recipientId, recipientId: initiatorId },
      ],
    },
  });
  if (existing) return existing;

  return await prisma.$transaction(async (tx) => {
    const connection = await tx.connection.create({
      data: {
        initiatorId,
        recipientId,
        status,
      },
    });

    await tx.connectionSide.create({
      data: {
        connectionId: connection.id,
        accountId: initiatorId,
        ...(initiatorGroupIds.length > 0
          ? { groups: { connect: initiatorGroupIds.map((id) => ({ id })) } }
          : {}),
      },
    });

    if (status === "ACCEPTED") {
      await tx.connectionSide.create({
        data: {
          connectionId: connection.id,
          accountId: recipientId,
          ...(recipientGroupIds.length > 0
            ? { groups: { connect: recipientGroupIds.map((id) => ({ id })) } }
            : {}),
        },
      });
    }

    return connection;
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
    {
      email: "test+kate@example.com",
      password: "kate1234",
      name: "Kate Morgan",
      username: "kate",
      publicListed: true,
    },
    {
      email: "test+leo@example.com",
      password: "leo1234",
      name: "Leo Martinez",
      username: "leo",
      publicListed: true,
    },
    {
      email: "test+mia@example.com",
      password: "mia1234",
      name: "Mia Thompson",
      username: "mia",
      publicListed: false,
    },
    {
      email: "test+noah@example.com",
      password: "noah1234",
      name: "Noah Garcia",
      username: "noah",
      publicListed: true,
    },
    {
      email: "test+olivia@example.com",
      password: "olivia1234",
      name: "Olivia Davis",
      username: "olivia",
      publicListed: false,
    },
    {
      email: "test+peter@example.com",
      password: "peter1234",
      name: "Peter Wang",
      username: "peter",
      publicListed: true,
    },
    {
      email: "test+quinn@example.com",
      password: "quinn1234",
      name: "Quinn Roberts",
      username: "quinn",
      publicListed: true,
    },
    {
      email: "test+rachel@example.com",
      password: "rachel1234",
      name: "Rachel Kim",
      username: "rachel",
      publicListed: false,
    },
    {
      email: "test+sam@example.com",
      password: "sam1234",
      name: "Sam Patel",
      username: "sam",
      publicListed: true,
    },
    {
      email: "test+tina@example.com",
      password: "tina1234",
      name: "Tina Brooks",
      username: "tina",
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
  const kate = users.kate;
  const leo = users.leo;
  const mia = users.mia;
  const noah = users.noah;
  const olivia = users.olivia;
  const peter = users.peter;
  const quinn = users.quinn;
  const rachel = users.rachel;
  const sam = users.sam;
  const tina = users.tina;

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

  // Kate traits
  const kateEmail = await getOrCreateTrait(kate.id, {
    key: "email",
    value: "kate@example.com",
    category: "CONTACT_INFO",
  });
  const kateTwitter = await getOrCreateTrait(kate.id, {
    key: "twitter",
    value: "https://twitter.com/kate",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(kate.id, {
    key: "linkedin",
    value: "https://linkedin.com/in/kate",
    category: "PROFESSIONAL_LINK",
  });
  await getOrCreateTrait(kate.id, {
    key: "instagram",
    value: "https://instagram.com/kate",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(kate.id, {
    key: "tiktok",
    value: "https://tiktok.com/@kate",
    category: "SOCIAL_LINK",
  });

  // Leo traits
  const leoEmail = await getOrCreateTrait(leo.id, {
    key: "email",
    value: "leo@example.com",
    category: "CONTACT_INFO",
  });
  const leoGithub = await getOrCreateTrait(leo.id, {
    key: "github",
    value: "https://github.com/leo",
    category: "PROFESSIONAL_LINK",
  });
  await getOrCreateTrait(leo.id, {
    key: "twitter",
    value: "https://twitter.com/leo",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(leo.id, {
    key: "website",
    value: "https://leo.dev",
    category: "WEBSITE_LINK",
  });
  await getOrCreateTrait(leo.id, {
    key: "discord",
    value: "leo#9999",
    category: "MESSAGING_HANDLE",
  });

  // Mia traits
  const miaPhone = await getOrCreateTrait(mia.id, {
    key: "phone",
    value: "+1112223333",
    category: "CONTACT_INFO",
  });
  const miaInstagram = await getOrCreateTrait(mia.id, {
    key: "instagram",
    value: "https://instagram.com/mia",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(mia.id, {
    key: "pinterest",
    value: "https://pinterest.com/mia",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(mia.id, {
    key: "youtube",
    value: "https://youtube.com/@mia",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(mia.id, {
    key: "whatsapp",
    value: "+1112223333",
    category: "MESSAGING_HANDLE",
  });

  // Noah traits
  const noahEmail = await getOrCreateTrait(noah.id, {
    key: "email",
    value: "noah@example.com",
    category: "CONTACT_INFO",
  });
  const noahLinkedin = await getOrCreateTrait(noah.id, {
    key: "linkedin",
    value: "https://linkedin.com/in/noah",
    category: "PROFESSIONAL_LINK",
  });
  await getOrCreateTrait(noah.id, {
    key: "twitter",
    value: "https://twitter.com/noah",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(noah.id, {
    key: "github",
    value: "https://github.com/noah",
    category: "PROFESSIONAL_LINK",
  });
  await getOrCreateTrait(noah.id, {
    key: "bluesky",
    value: "https://bsky.app/profile/noah",
    category: "SOCIAL_LINK",
  });

  // Olivia traits
  await getOrCreateTrait(olivia.id, {
    key: "email",
    value: "olivia@example.com",
    category: "CONTACT_INFO",
  });
  await getOrCreateTrait(olivia.id, {
    key: "phone",
    value: "+4445556666",
    category: "CONTACT_INFO",
  });
  await getOrCreateTrait(olivia.id, {
    key: "instagram",
    value: "https://instagram.com/olivia",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(olivia.id, {
    key: "tiktok",
    value: "https://tiktok.com/@olivia",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(olivia.id, {
    key: "snapchat",
    value: "olivia_snap",
    category: "MESSAGING_HANDLE",
  });

  // Peter traits
  const peterEmail = await getOrCreateTrait(peter.id, {
    key: "email",
    value: "peter@example.com",
    category: "CONTACT_INFO",
  });
  const peterTwitter = await getOrCreateTrait(peter.id, {
    key: "twitter",
    value: "https://twitter.com/peter",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(peter.id, {
    key: "linkedin",
    value: "https://linkedin.com/in/peter",
    category: "PROFESSIONAL_LINK",
  });
  await getOrCreateTrait(peter.id, {
    key: "github",
    value: "https://github.com/peter",
    category: "PROFESSIONAL_LINK",
  });
  await getOrCreateTrait(peter.id, {
    key: "reddit",
    value: "https://reddit.com/user/peter",
    category: "SOCIAL_LINK",
  });

  // Quinn traits
  const quinnEmail = await getOrCreateTrait(quinn.id, {
    key: "email",
    value: "quinn@example.com",
    category: "CONTACT_INFO",
  });
  const quinnWebsite = await getOrCreateTrait(quinn.id, {
    key: "website",
    value: "https://quinn.design",
    category: "WEBSITE_LINK",
  });
  await getOrCreateTrait(quinn.id, {
    key: "instagram",
    value: "https://instagram.com/quinn",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(quinn.id, {
    key: "dribbble",
    value: "https://dribbble.com/quinn",
    category: "PROFESSIONAL_LINK",
  });
  await getOrCreateTrait(quinn.id, {
    key: "behance",
    value: "https://behance.net/quinn",
    category: "PROFESSIONAL_LINK",
  });

  // Rachel traits
  await getOrCreateTrait(rachel.id, {
    key: "email",
    value: "rachel@example.com",
    category: "CONTACT_INFO",
  });
  await getOrCreateTrait(rachel.id, {
    key: "phone",
    value: "+7778889999",
    category: "CONTACT_INFO",
  });
  await getOrCreateTrait(rachel.id, {
    key: "linkedin",
    value: "https://linkedin.com/in/rachel",
    category: "PROFESSIONAL_LINK",
  });
  await getOrCreateTrait(rachel.id, {
    key: "twitter",
    value: "https://twitter.com/rachel",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(rachel.id, {
    key: "telegram",
    value: "https://t.me/rachel",
    category: "MESSAGING_HANDLE",
  });

  // Sam traits
  const samEmail = await getOrCreateTrait(sam.id, {
    key: "email",
    value: "sam@example.com",
    category: "CONTACT_INFO",
  });
  const samGithub = await getOrCreateTrait(sam.id, {
    key: "github",
    value: "https://github.com/sam",
    category: "PROFESSIONAL_LINK",
  });
  await getOrCreateTrait(sam.id, {
    key: "twitter",
    value: "https://twitter.com/sam",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(sam.id, {
    key: "linkedin",
    value: "https://linkedin.com/in/sam",
    category: "PROFESSIONAL_LINK",
  });
  await getOrCreateTrait(sam.id, {
    key: "discord",
    value: "sam#4321",
    category: "MESSAGING_HANDLE",
  });

  // Tina traits
  await getOrCreateTrait(tina.id, {
    key: "email",
    value: "tina@example.com",
    category: "CONTACT_INFO",
  });
  await getOrCreateTrait(tina.id, {
    key: "phone",
    value: "+2223334444",
    category: "CONTACT_INFO",
  });
  await getOrCreateTrait(tina.id, {
    key: "instagram",
    value: "https://instagram.com/tina",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(tina.id, {
    key: "youtube",
    value: "https://youtube.com/@tina",
    category: "SOCIAL_LINK",
  });
  await getOrCreateTrait(tina.id, {
    key: "spotify",
    value: "https://open.spotify.com/user/tina",
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

  const kateSocial = await getOrCreateGroup(kate.id, "Social", [
    kateEmail.id,
    kateTwitter.id,
  ]);
  const kateWork = await getOrCreateGroup(kate.id, "Work");

  const leoDevContacts = await getOrCreateGroup(leo.id, "Dev Contacts", [
    leoEmail.id,
    leoGithub.id,
  ]);
  const leoSocial = await getOrCreateGroup(leo.id, "Social");

  const miaCloseFriends = await getOrCreateGroup(mia.id, "Close Friends", [
    miaPhone.id,
    miaInstagram.id,
  ]);
  const miaCreative = await getOrCreateGroup(mia.id, "Creative");

  const noahNetworks = await getOrCreateGroup(noah.id, "Networks", [
    noahEmail.id,
    noahLinkedin.id,
  ]);
  const noahFriends = await getOrCreateGroup(noah.id, "Friends");

  const oliviaSocial = await getOrCreateGroup(olivia.id, "Social");
  const oliviaCloseFriends = await getOrCreateGroup(olivia.id, "Close Friends");

  const peterDevContacts = await getOrCreateGroup(peter.id, "Dev Contacts", [
    peterEmail.id,
    peterTwitter.id,
  ]);
  const peterProfessional = await getOrCreateGroup(peter.id, "Professional");

  const quinnPortfolio = await getOrCreateGroup(quinn.id, "Portfolio", [
    quinnEmail.id,
    quinnWebsite.id,
  ]);
  const quinnSocial = await getOrCreateGroup(quinn.id, "Social");

  const rachelWork = await getOrCreateGroup(rachel.id, "Work");
  const rachelPersonal = await getOrCreateGroup(rachel.id, "Personal");

  const samDevContacts = await getOrCreateGroup(sam.id, "Dev Contacts", [
    samEmail.id,
    samGithub.id,
  ]);
  const samSocial = await getOrCreateGroup(sam.id, "Social");

  const tinaSocial = await getOrCreateGroup(tina.id, "Social");
  const tinaMusic = await getOrCreateGroup(tina.id, "Music");

  // Connections (single shared records with ConnectionSides)
  // Each call: getOrCreateConnection(initiator, recipient, status, initiatorGroups, recipientGroups)

  // Alice connections
  await getOrCreateConnection(
    alice.id,
    bob.id,
    ConnectionStatus.ACCEPTED,
    [aliceCloseFriends.id],
    [bobColleagues.id],
  );
  await getOrCreateConnection(alice.id, charlie.id, ConnectionStatus.ACCEPTED);
  await getOrCreateConnection(
    alice.id,
    eve.id,
    ConnectionStatus.ACCEPTED,
    [aliceProfessional.id],
    [eveNetworks.id],
  );

  // Bob connections (already created above for alice-bob)
  await getOrCreateConnection(bob.id, charlie.id, ConnectionStatus.ACCEPTED, [
    bobColleagues.id,
  ]);
  await getOrCreateConnection(bob.id, diana.id, ConnectionStatus.ACCEPTED, [
    bobSocial.id,
  ]);

  // Charlie connections (alice-charlie already created)
  await getOrCreateConnection(charlie.id, grace.id, ConnectionStatus.ACCEPTED, [
    charlieDevContacts.id,
  ]);

  // Diana connections (bob-diana already created)
  await getOrCreateConnection(
    diana.id,
    eve.id,
    ConnectionStatus.ACCEPTED,
    [dianaSocial.id],
    [eveCloseFriends.id],
  );
  await getOrCreateConnection(diana.id, frank.id, ConnectionStatus.ACCEPTED);

  // Eve connections (alice-eve, diana-eve already created)
  await getOrCreateConnection(eve.id, iris.id, ConnectionStatus.ACCEPTED);

  // Frank connections (diana-frank already created)
  await getOrCreateConnection(
    frank.id,
    grace.id,
    ConnectionStatus.ACCEPTED,
    [frankMusic.id],
    [graceCreative.id],
  );
  await getOrCreateConnection(
    frank.id,
    henry.id,
    ConnectionStatus.ACCEPTED,
    [frankDevContacts.id],
    [henryDevContacts.id],
  );

  // Grace connections (charlie-grace, frank-grace already created)
  await getOrCreateConnection(grace.id, iris.id, ConnectionStatus.ACCEPTED);

  // Henry connections (frank-henry already created)
  await getOrCreateConnection(henry.id, iris.id, ConnectionStatus.ACCEPTED, [
    henryFriends.id,
  ]);
  await getOrCreateConnection(henry.id, jack.id, ConnectionStatus.ACCEPTED);

  // Iris connections (eve-iris, grace-iris, henry-iris already created)
  await getOrCreateConnection(
    iris.id,
    jack.id,
    ConnectionStatus.ACCEPTED,
    [irisSocial.id],
    [jackDevContacts.id],
  );

  // Jack connections (henry-jack, iris-jack already created)

  // Kate connections
  await getOrCreateConnection(kate.id, alice.id, ConnectionStatus.ACCEPTED, [
    kateSocial.id,
  ]);
  await getOrCreateConnection(kate.id, eve.id, ConnectionStatus.ACCEPTED, [
    kateSocial.id,
  ]);
  await getOrCreateConnection(kate.id, leo.id, ConnectionStatus.ACCEPTED);
  await getOrCreateConnection(kate.id, noah.id, ConnectionStatus.ACCEPTED, [
    kateWork.id,
  ]);

  // Leo connections (kate-leo already created)
  await getOrCreateConnection(leo.id, charlie.id, ConnectionStatus.ACCEPTED, [
    leoDevContacts.id,
  ]);
  await getOrCreateConnection(
    leo.id,
    peter.id,
    ConnectionStatus.ACCEPTED,
    [leoSocial.id],
    [peterDevContacts.id],
  );
  await getOrCreateConnection(
    leo.id,
    sam.id,
    ConnectionStatus.ACCEPTED,
    [leoDevContacts.id],
    [samDevContacts.id],
  );

  // Mia connections
  await getOrCreateConnection(mia.id, diana.id, ConnectionStatus.ACCEPTED, [
    miaCloseFriends.id,
  ]);
  await getOrCreateConnection(mia.id, grace.id, ConnectionStatus.ACCEPTED, [
    miaCreative.id,
  ]);
  await getOrCreateConnection(mia.id, olivia.id, ConnectionStatus.ACCEPTED);
  await getOrCreateConnection(
    mia.id,
    tina.id,
    ConnectionStatus.ACCEPTED,
    [miaCloseFriends.id],
    [tinaSocial.id],
  );

  // Noah connections (kate-noah already created)
  await getOrCreateConnection(noah.id, bob.id, ConnectionStatus.ACCEPTED, [
    noahNetworks.id,
  ]);
  await getOrCreateConnection(
    noah.id,
    peter.id,
    ConnectionStatus.ACCEPTED,
    [noahFriends.id],
    [peterProfessional.id],
  );
  await getOrCreateConnection(
    noah.id,
    sam.id,
    ConnectionStatus.ACCEPTED,
    [noahNetworks.id],
    [samSocial.id],
  );

  // Olivia connections (mia-olivia already created)
  await getOrCreateConnection(
    olivia.id,
    tina.id,
    ConnectionStatus.ACCEPTED,
    [oliviaCloseFriends.id],
    [tinaMusic.id],
  );
  await getOrCreateConnection(olivia.id, quinn.id, ConnectionStatus.ACCEPTED);

  // Peter connections (leo-peter, noah-peter already created)
  await getOrCreateConnection(peter.id, sam.id, ConnectionStatus.ACCEPTED, [
    peterDevContacts.id,
  ]);
  await getOrCreateConnection(peter.id, quinn.id, ConnectionStatus.ACCEPTED);

  // Quinn connections (olivia-quinn, peter-quinn already created)
  await getOrCreateConnection(
    quinn.id,
    rachel.id,
    ConnectionStatus.ACCEPTED,
    [quinnPortfolio.id],
    [rachelWork.id],
  );

  // Rachel connections (quinn-rachel already created)
  await getOrCreateConnection(rachel.id, sam.id, ConnectionStatus.ACCEPTED);
  await getOrCreateConnection(rachel.id, henry.id, ConnectionStatus.ACCEPTED, [
    rachelPersonal.id,
  ]);

  // Sam connections (leo-sam, noah-sam, peter-sam, rachel-sam already created)

  // Tina connections (mia-tina, olivia-tina already created)
  await getOrCreateConnection(tina.id, grace.id, ConnectionStatus.ACCEPTED);

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
