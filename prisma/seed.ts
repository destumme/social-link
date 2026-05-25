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
        category: "EMAIL",
        accountId: alice.id,
      },
    });

    const alicePhone = await tx.trait.create({
      data: {
        key: "phone",
        value: "+1234567890",
        category: "PHONE_NUMBER",
        accountId: alice.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "linkedin",
        value: "https://linkedin.com/in/alice",
        category: "LINKEDIN",
        accountId: alice.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "instagram",
        value: "https://instagram.com/alice",
        category: "INSTAGRAM",
        accountId: alice.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "discord",
        value: "alice#1234",
        category: "DISCORD",
        accountId: alice.id,
      },
    });

    // Bob: 5 traits
    const bobTwitter = await tx.trait.create({
      data: {
        key: "twitter",
        value: "https://twitter.com/bob",
        category: "SOCIAL_MEDIA_LINK",
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
        category: "LINKEDIN",
        accountId: bob.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "spotify",
        value: "https://open.spotify.com/user/bob",
        category: "SPOTIFY",
        accountId: bob.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "twitch",
        value: "https://twitch.tv/bob",
        category: "TWITCH",
        accountId: bob.id,
      },
    });

    // Charlie: 5 traits
    const charlieEmail = await tx.trait.create({
      data: {
        key: "email",
        value: "charlie@example.com",
        category: "EMAIL",
        accountId: charlie.id,
      },
    });

    const charlieGithub = await tx.trait.create({
      data: {
        key: "github",
        value: "https://github.com/charlie",
        category: "GITHUB",
        accountId: charlie.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "linkedin",
        value: "https://linkedin.com/in/charlie",
        category: "LINKEDIN",
        accountId: charlie.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "telegram",
        value: "https://t.me/charlie",
        category: "TELEGRAM",
        accountId: charlie.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "bluesky",
        value: "https://bsky.app/profile/charlie",
        category: "BLUESKY",
        accountId: charlie.id,
      },
    });

    // Diana: 5 traits
    const dianaPhone = await tx.trait.create({
      data: {
        key: "phone",
        value: "+0987654321",
        category: "PHONE_NUMBER",
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
        category: "INSTAGRAM",
        accountId: diana.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "youtube",
        value: "https://youtube.com/@diana",
        category: "YOUTUBE",
        accountId: diana.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "whatsapp",
        value: "+0987654321",
        category: "WHATSAPP",
        accountId: diana.id,
      },
    });

    // Eve: 5 traits
    const eveEmail = await tx.trait.create({
      data: {
        key: "email",
        value: "eve@example.com",
        category: "EMAIL",
        accountId: eve.id,
      },
    });

    const eveTwitter = await tx.trait.create({
      data: {
        key: "twitter",
        value: "https://twitter.com/eve",
        category: "SOCIAL_MEDIA_LINK",
        accountId: eve.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "instagram",
        value: "https://instagram.com/eve",
        category: "INSTAGRAM",
        accountId: eve.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "github",
        value: "https://github.com/eve",
        category: "GITHUB",
        accountId: eve.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "reddit",
        value: "https://reddit.com/user/eve",
        category: "REDDIT",
        accountId: eve.id,
      },
    });

    // Frank: 5 traits
    await tx.trait.create({
      data: {
        key: "email",
        value: "frank@example.com",
        category: "EMAIL",
        accountId: frank.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "linkedin",
        value: "https://linkedin.com/in/frank",
        category: "LINKEDIN",
        accountId: frank.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "twitch",
        value: "https://twitch.tv/frank",
        category: "TWITCH",
        accountId: frank.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "spotify",
        value: "https://open.spotify.com/user/frank",
        category: "SPOTIFY",
        accountId: frank.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "discord",
        value: "frank#5678",
        category: "DISCORD",
        accountId: frank.id,
      },
    });

    // Grace: 5 traits
    await tx.trait.create({
      data: {
        key: "email",
        value: "grace@example.com",
        category: "EMAIL",
        accountId: grace.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "phone",
        value: "+1122334455",
        category: "PHONE_NUMBER",
        accountId: grace.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "instagram",
        value: "https://instagram.com/grace",
        category: "INSTAGRAM",
        accountId: grace.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "youtube",
        value: "https://youtube.com/@grace",
        category: "YOUTUBE",
        accountId: grace.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "bluesky",
        value: "https://bsky.app/profile/grace",
        category: "BLUESKY",
        accountId: grace.id,
      },
    });

    // Henry: 5 traits
    await tx.trait.create({
      data: {
        key: "email",
        value: "henry@example.com",
        category: "EMAIL",
        accountId: henry.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "phone",
        value: "+5566778899",
        category: "PHONE_NUMBER",
        accountId: henry.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "github",
        value: "https://github.com/henry",
        category: "GITHUB",
        accountId: henry.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "telegram",
        value: "https://t.me/henry",
        category: "TELEGRAM",
        accountId: henry.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "reddit",
        value: "https://reddit.com/user/henry",
        category: "REDDIT",
        accountId: henry.id,
      },
    });

    // Iris: 5 traits
    await tx.trait.create({
      data: {
        key: "email",
        value: "iris@example.com",
        category: "EMAIL",
        accountId: iris.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "linkedin",
        value: "https://linkedin.com/in/iris",
        category: "LINKEDIN",
        accountId: iris.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "instagram",
        value: "https://instagram.com/iris",
        category: "INSTAGRAM",
        accountId: iris.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "whatsapp",
        value: "+1231231234",
        category: "WHATSAPP",
        accountId: iris.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "threads",
        value: "https://threads.net/@iris",
        category: "THREADS",
        accountId: iris.id,
      },
    });

    // Jack: 5 traits
    await tx.trait.create({
      data: {
        key: "email",
        value: "jack@example.com",
        category: "EMAIL",
        accountId: jack.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "phone",
        value: "+9998887776",
        category: "PHONE_NUMBER",
        accountId: jack.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "twitter",
        value: "https://twitter.com/jack",
        category: "SOCIAL_MEDIA_LINK",
        accountId: jack.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "github",
        value: "https://github.com/jack",
        category: "GITHUB",
        accountId: jack.id,
      },
    });

    await tx.trait.create({
      data: {
        key: "spotify",
        value: "https://open.spotify.com/user/jack",
        category: "SPOTIFY",
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
