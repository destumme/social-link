import { prisma } from "@/lib/database/prisma";

async function main() {
  await prisma.$transaction(async (tx) => {
    const alice = await tx.account.create({
      data: {
        displayName: "Alice Smith",
        username: "alice",
        publicListed: false,
      },
    });

    const bob = await tx.account.create({
      data: {
        displayName: "Bob Jones",
        username: "bob",
        publicListed: false,
      },
    });

    const charlie = await tx.account.create({
      data: {
        displayName: "Charlie Brown",
        username: "charlie",
        publicListed: false,
      },
    });

    const diana = await tx.account.create({
      data: {
        displayName: "Diana Prince",
        username: "diana",
        publicListed: false,
      },
    });

    const eve = await tx.account.create({
      data: {
        displayName: "Eve Wilson",
        username: "eve",
        publicListed: true,
      },
    });

    const frank = await tx.account.create({
      data: {
        displayName: "Frank Miller",
        username: "frank",
        publicListed: true,
      },
    });

    const grace = await tx.account.create({
      data: {
        displayName: "Grace Lee",
        username: "grace",
        publicListed: true,
      },
    });

    const henry = await tx.account.create({
      data: {
        displayName: "Henry Adams",
        username: "henry",
        publicListed: false,
      },
    });

    const iris = await tx.account.create({
      data: {
        displayName: "Iris Chen",
        username: "iris",
        publicListed: true,
      },
    });

    const jack = await tx.account.create({
      data: {
        displayName: "Jack Turner",
        username: "jack",
        publicListed: false,
      },
    });

    // Alice: 5 traits
    const aliceEmail = await tx.trait.create({
      data: {
        key: "email",
        value: "alice@example.com",
        category: "CONTACT_INFO",
        accountId: alice.id,
      },
    });

    const alicePhone = await tx.trait.create({
      data: {
        key: "phone",
        value: "+1234567890",
        category: "CONTACT_INFO",
        accountId: alice.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "linkedin",
        value: "https://linkedin.com/in/alice",
        category: "PROFESSIONAL_LINK",
        accountId: alice.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "instagram",
        value: "https://instagram.com/alice",
        category: "SOCIAL_LINK",
        accountId: alice.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "discord",
        value: "alice#1234",
        category: "MESSAGING_HANDLE",
        accountId: alice.id,
      },
    });

    // Bob: 5 traits
    const bobTwitter = await tx.trait.create({
      data: {
        key: "twitter",
        value: "https://twitter.com/bob",
        category: "SOCIAL_LINK",
        accountId: bob.id,
      },
    });

    const bobWebsite = await tx.trait.create({
      data: {
        key: "website",
        value: "https://bob.dev",
        category: "WEBSITE_LINK",
        accountId: bob.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "linkedin",
        value: "https://linkedin.com/in/bob",
        category: "PROFESSIONAL_LINK",
        accountId: bob.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "spotify",
        value: "https://open.spotify.com/user/bob",
        category: "OTHER",
        accountId: bob.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "twitch",
        value: "https://twitch.tv/bob",
        category: "OTHER",
        accountId: bob.id,
      },
    });

    // Charlie: 5 traits
    const charlieEmail = await tx.trait.create({
      data: {
        key: "email",
        value: "charlie@example.com",
        category: "CONTACT_INFO",
        accountId: charlie.id,
      },
    });

    const charlieGithub = await tx.trait.create({
      data: {
        key: "github",
        value: "https://github.com/charlie",
        category: "PROFESSIONAL_LINK",
        accountId: charlie.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "linkedin",
        value: "https://linkedin.com/in/charlie",
        category: "PROFESSIONAL_LINK",
        accountId: charlie.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "telegram",
        value: "https://t.me/charlie",
        category: "MESSAGING_HANDLE",
        accountId: charlie.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "bluesky",
        value: "https://bsky.app/profile/charlie",
        category: "SOCIAL_LINK",
        accountId: charlie.id,
      },
    });

    // Diana: 5 traits
    const dianaPhone = await tx.trait.create({
      data: {
        key: "phone",
        value: "+0987654321",
        category: "CONTACT_INFO",
        accountId: diana.id,
      },
    });

    const dianaWebsite = await tx.trait.create({
      data: {
        key: "website",
        value: "https://diana.dev",
        category: "WEBSITE_LINK",
        accountId: diana.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "instagram",
        value: "https://instagram.com/diana",
        category: "SOCIAL_LINK",
        accountId: diana.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "youtube",
        value: "https://youtube.com/@diana",
        category: "SOCIAL_LINK",
        accountId: diana.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "whatsapp",
        value: "+0987654321",
        category: "MESSAGING_HANDLE",
        accountId: diana.id,
      },
    });

    // Eve: 5 traits
    const eveEmail = await tx.trait.create({
      data: {
        key: "email",
        value: "eve@example.com",
        category: "CONTACT_INFO",
        accountId: eve.id,
      },
    });

    const eveTwitter = await tx.trait.create({
      data: {
        key: "twitter",
        value: "https://twitter.com/eve",
        category: "SOCIAL_LINK",
        accountId: eve.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "instagram",
        value: "https://instagram.com/eve",
        category: "SOCIAL_LINK",
        accountId: eve.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "github",
        value: "https://github.com/eve",
        category: "PROFESSIONAL_LINK",
        accountId: eve.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "reddit",
        value: "https://reddit.com/user/eve",
        category: "SOCIAL_LINK",
        accountId: eve.id,
      },
    });

    // Frank: 5 traits
    await tx.trait.create({
      data: {
        key: "email",
        value: "frank@example.com",
        category: "CONTACT_INFO",
        accountId: frank.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "linkedin",
        value: "https://linkedin.com/in/frank",
        category: "PROFESSIONAL_LINK",
        accountId: frank.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "twitch",
        value: "https://twitch.tv/frank",
        category: "OTHER",
        accountId: frank.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "spotify",
        value: "https://open.spotify.com/user/frank",
        category: "OTHER",
        accountId: frank.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "discord",
        value: "frank#5678",
        category: "MESSAGING_HANDLE",
        accountId: frank.id,
      },
    });

    // Grace: 5 traits
    await tx.trait.create({
      data: {
        key: "email",
        value: "grace@example.com",
        category: "CONTACT_INFO",
        accountId: grace.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "phone",
        value: "+1122334455",
        category: "CONTACT_INFO",
        accountId: grace.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "instagram",
        value: "https://instagram.com/grace",
        category: "SOCIAL_LINK",
        accountId: grace.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "youtube",
        value: "https://youtube.com/@grace",
        category: "SOCIAL_LINK",
        accountId: grace.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "bluesky",
        value: "https://bsky.app/profile/grace",
        category: "SOCIAL_LINK",
        accountId: grace.id,
      },
    });

    // Henry: 5 traits
    await tx.trait.create({
      data: {
        key: "email",
        value: "henry@example.com",
        category: "CONTACT_INFO",
        accountId: henry.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "phone",
        value: "+5566778899",
        category: "CONTACT_INFO",
        accountId: henry.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "github",
        value: "https://github.com/henry",
        category: "PROFESSIONAL_LINK",
        accountId: henry.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "telegram",
        value: "https://t.me/henry",
        category: "MESSAGING_HANDLE",
        accountId: henry.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "reddit",
        value: "https://reddit.com/user/henry",
        category: "SOCIAL_LINK",
        accountId: henry.id,
      },
    });

    // Iris: 5 traits
    await tx.trait.create({
      data: {
        key: "email",
        value: "iris@example.com",
        category: "CONTACT_INFO",
        accountId: iris.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "linkedin",
        value: "https://linkedin.com/in/iris",
        category: "PROFESSIONAL_LINK",
        accountId: iris.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "instagram",
        value: "https://instagram.com/iris",
        category: "SOCIAL_LINK",
        accountId: iris.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "whatsapp",
        value: "+1231231234",
        category: "MESSAGING_HANDLE",
        accountId: iris.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "threads",
        value: "https://threads.net/@iris",
        category: "SOCIAL_LINK",
        accountId: iris.id,
      },
    });

    // Jack: 5 traits
    await tx.trait.create({
      data: {
        key: "email",
        value: "jack@example.com",
        category: "CONTACT_INFO",
        accountId: jack.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "phone",
        value: "+9998887776",
        category: "CONTACT_INFO",
        accountId: jack.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "twitter",
        value: "https://twitter.com/jack",
        category: "SOCIAL_LINK",
        accountId: jack.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "github",
        value: "https://github.com/jack",
        category: "PROFESSIONAL_LINK",
        accountId: jack.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "spotify",
        value: "https://open.spotify.com/user/jack",
        category: "OTHER",
        accountId: jack.id,
      },
    });

    const aliceCloseFriends = await tx.connectionGroup.create({
      data: {
        name: "Close Friends",
        accountId: alice.id,
        traits: { connect: [{ id: aliceEmail.id }, { id: alicePhone.id }] },
      },
    });

    const bobColleagues = await tx.connectionGroup.create({
      data: {
        name: "Colleagues",
        accountId: bob.id,
        traits: { connect: [{ id: bobTwitter.id }] },
      },
    });

    await tx.connection.create({
      data: {
        accountId: alice.id,
        connectedAccountId: bob.id,
        status: "ACCEPTED",
        groups: [aliceCloseFriends.id],
      },
    });

    await tx.connection.create({
      data: {
        accountId: bob.id,
        connectedAccountId: alice.id,
        status: "ACCEPTED",
        groups: [bobColleagues.id],
      },
    });

    console.log(
      "Seeded 10 accounts, 2 connections, 50 traits, 2 connection groups",
    );
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
