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
        category: "SOCIAL_MEDIA_LINK",
        accountId: charlie.id,
      },
    });

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

    const aliceCloseFriends = await tx.connectionGroup.create({
      data: {
        name: "Close Friends",
        accountId: alice.id,
        traits: [aliceEmail.id, alicePhone.id],
      },
    });

    const bobColleagues = await tx.connectionGroup.create({
      data: {
        name: "Colleagues",
        accountId: bob.id,
        traits: [bobTwitter.id],
      },
    });

    await tx.connection.create({
      data: {
        accountId: alice.id,
        connectedAccountId: bob.id,
        status: "ACCEPTED",
        groups: [aliceCloseFriends.id],
        traits: [aliceEmail.id],
      },
    });

    await tx.connection.create({
      data: {
        accountId: bob.id,
        connectedAccountId: alice.id,
        status: "ACCEPTED",
        groups: [bobColleagues.id],
        traits: [bobTwitter.id],
      },
    });

    console.log(
      "Seeded 5 accounts, 2 connections, 9 traits, 2 connection groups",
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
