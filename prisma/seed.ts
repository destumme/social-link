import { prisma } from "@/lib/database/prisma";
import { auth } from "@/lib/auth";

async function main() {
  const alice = await auth.api.signUpEmail({
    body: {
      email: "test+alice@example.com",
      password: "alice123",
      name: "Alice Smith",
      username: "alice",
    },
  });

  const bob = await auth.api.signUpEmail({
    body: {
      email: "test+bob@example.com",
      password: "bob12345",
      name: "Bob Jones",
      username: "bob",
    },
  });

  const charlie = await auth.api.signUpEmail({
    body: {
      email: "test+charlie@example.com",
      password: "charlie1",
      name: "Charlie Brown",
      username: "charlie",
    },
  });

  const diana = await auth.api.signUpEmail({
    body: {
      email: "test+diana@example.com",
      password: "diana123",
      name: "Diana Prince",
      username: "diana",
    },
  });

  const eve = await auth.api.signUpEmail({
    body: {
      email: "test+eve@example.com",
      password: "eve12345",
      name: "Eve Wilson",
      username: "eve",
    },
  });

  const frank = await auth.api.signUpEmail({
    body: {
      email: "test+frank@example.com",
      password: "frank123",
      name: "Frank Miller",
      username: "frank",
    },
  });

  const grace = await auth.api.signUpEmail({
    body: {
      email: "test+grace@example.com",
      password: "grace123",
      name: "Grace Lee",
      username: "grace",
    },
  });

  const henry = await auth.api.signUpEmail({
    body: {
      email: "test+henry@example.com",
      password: "henry123",
      name: "Henry Adams",
      username: "henry",
    },
  });

  const iris = await auth.api.signUpEmail({
    body: {
      email: "test+iris@example.com",
      password: "iris1234",
      name: "Iris Chen",
      username: "iris",
    },
  });

  const jack = await auth.api.signUpEmail({
    body: {
      email: "test+jack@example.com",
      password: "jack1234",
      name: "Jack Turner",
      username: "jack",
    },
  });

  // The before hook sets publicListed: true by default, so update those that should be false
  await prisma.user.update({
    where: { id: alice.user.id },
    data: { publicListed: false },
  });
  await prisma.user.update({
    where: { id: bob.user.id },
    data: { publicListed: false },
  });
  await prisma.user.update({
    where: { id: charlie.user.id },
    data: { publicListed: false },
  });
  await prisma.user.update({
    where: { id: diana.user.id },
    data: { publicListed: false },
  });
  await prisma.user.update({
    where: { id: henry.user.id },
    data: { publicListed: false },
  });
  await prisma.user.update({
    where: { id: jack.user.id },
    data: { publicListed: false },
  });

  // Alice: 5 traits
  const aliceEmail = await prisma.trait.create({
    data: {
      key: "email",
      value: "alice@example.com",
      category: "CONTACT_INFO",
      accountId: alice.user.id,
    },
  });

  const alicePhone = await prisma.trait.create({
    data: {
      key: "phone",
      value: "+1234567890",
      category: "CONTACT_INFO",
      accountId: alice.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "linkedin",
      value: "https://linkedin.com/in/alice",
      category: "PROFESSIONAL_LINK",
      accountId: alice.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "instagram",
      value: "https://instagram.com/alice",
      category: "SOCIAL_LINK",
      accountId: alice.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "discord",
      value: "alice#1234",
      category: "MESSAGING_HANDLE",
      accountId: alice.user.id,
    },
  });

  // Bob: 5 traits
  const bobTwitter = await prisma.trait.create({
    data: {
      key: "twitter",
      value: "https://twitter.com/bob",
      category: "SOCIAL_LINK",
      accountId: bob.user.id,
    },
  });

  const bobWebsite = await prisma.trait.create({
    data: {
      key: "website",
      value: "https://bob.dev",
      category: "WEBSITE_LINK",
      accountId: bob.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "linkedin",
      value: "https://linkedin.com/in/bob",
      category: "PROFESSIONAL_LINK",
      accountId: bob.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "spotify",
      value: "https://open.spotify.com/user/bob",
      category: "OTHER",
      accountId: bob.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "twitch",
      value: "https://twitch.tv/bob",
      category: "OTHER",
      accountId: bob.user.id,
    },
  });

  // Charlie: 5 traits
  const charlieEmail = await prisma.trait.create({
    data: {
      key: "email",
      value: "charlie@example.com",
      category: "CONTACT_INFO",
      accountId: charlie.user.id,
    },
  });

  const charlieGithub = await prisma.trait.create({
    data: {
      key: "github",
      value: "https://github.com/charlie",
      category: "PROFESSIONAL_LINK",
      accountId: charlie.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "linkedin",
      value: "https://linkedin.com/in/charlie",
      category: "PROFESSIONAL_LINK",
      accountId: charlie.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "telegram",
      value: "https://t.me/charlie",
      category: "MESSAGING_HANDLE",
      accountId: charlie.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "bluesky",
      value: "https://bsky.app/profile/charlie",
      category: "SOCIAL_LINK",
      accountId: charlie.user.id,
    },
  });

  // Diana: 5 traits
  const dianaPhone = await prisma.trait.create({
    data: {
      key: "phone",
      value: "+0987654321",
      category: "CONTACT_INFO",
      accountId: diana.user.id,
    },
  });

  const dianaWebsite = await prisma.trait.create({
    data: {
      key: "website",
      value: "https://diana.dev",
      category: "WEBSITE_LINK",
      accountId: diana.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "instagram",
      value: "https://instagram.com/diana",
      category: "SOCIAL_LINK",
      accountId: diana.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "youtube",
      value: "https://youtube.com/@diana",
      category: "SOCIAL_LINK",
      accountId: diana.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "whatsapp",
      value: "+0987654321",
      category: "MESSAGING_HANDLE",
      accountId: diana.user.id,
    },
  });

  // Eve: 5 traits
  const eveEmail = await prisma.trait.create({
    data: {
      key: "email",
      value: "eve@example.com",
      category: "CONTACT_INFO",
      accountId: eve.user.id,
    },
  });

  const eveTwitter = await prisma.trait.create({
    data: {
      key: "twitter",
      value: "https://twitter.com/eve",
      category: "SOCIAL_LINK",
      accountId: eve.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "instagram",
      value: "https://instagram.com/eve",
      category: "SOCIAL_LINK",
      accountId: eve.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "github",
      value: "https://github.com/eve",
      category: "PROFESSIONAL_LINK",
      accountId: eve.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "reddit",
      value: "https://reddit.com/user/eve",
      category: "SOCIAL_LINK",
      accountId: eve.user.id,
    },
  });

  // Frank: 5 traits
  await prisma.trait.create({
    data: {
      key: "email",
      value: "frank@example.com",
      category: "CONTACT_INFO",
      accountId: frank.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "linkedin",
      value: "https://linkedin.com/in/frank",
      category: "PROFESSIONAL_LINK",
      accountId: frank.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "twitch",
      value: "https://twitch.tv/frank",
      category: "OTHER",
      accountId: frank.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "spotify",
      value: "https://open.spotify.com/user/frank",
      category: "OTHER",
      accountId: frank.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "discord",
      value: "frank#5678",
      category: "MESSAGING_HANDLE",
      accountId: frank.user.id,
    },
  });

  // Grace: 5 traits
  await prisma.trait.create({
    data: {
      key: "email",
      value: "grace@example.com",
      category: "CONTACT_INFO",
      accountId: grace.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "phone",
      value: "+1122334455",
      category: "CONTACT_INFO",
      accountId: grace.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "instagram",
      value: "https://instagram.com/grace",
      category: "SOCIAL_LINK",
      accountId: grace.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "youtube",
      value: "https://youtube.com/@grace",
      category: "SOCIAL_LINK",
      accountId: grace.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "bluesky",
      value: "https://bsky.app/profile/grace",
      category: "SOCIAL_LINK",
      accountId: grace.user.id,
    },
  });

  // Henry: 5 traits
  await prisma.trait.create({
    data: {
      key: "email",
      value: "henry@example.com",
      category: "CONTACT_INFO",
      accountId: henry.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "phone",
      value: "+5566778899",
      category: "CONTACT_INFO",
      accountId: henry.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "github",
      value: "https://github.com/henry",
      category: "PROFESSIONAL_LINK",
      accountId: henry.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "telegram",
      value: "https://t.me/henry",
      category: "MESSAGING_HANDLE",
      accountId: henry.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "reddit",
      value: "https://reddit.com/user/henry",
      category: "SOCIAL_LINK",
      accountId: henry.user.id,
    },
  });

  // Iris: 5 traits
  await prisma.trait.create({
    data: {
      key: "email",
      value: "iris@example.com",
      category: "CONTACT_INFO",
      accountId: iris.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "linkedin",
      value: "https://linkedin.com/in/iris",
      category: "PROFESSIONAL_LINK",
      accountId: iris.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "instagram",
      value: "https://instagram.com/iris",
      category: "SOCIAL_LINK",
      accountId: iris.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "whatsapp",
      value: "+1231231234",
      category: "MESSAGING_HANDLE",
      accountId: iris.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "threads",
      value: "https://threads.net/@iris",
      category: "SOCIAL_LINK",
      accountId: iris.user.id,
    },
  });

  // Jack: 5 traits
  await prisma.trait.create({
    data: {
      key: "email",
      value: "jack@example.com",
      category: "CONTACT_INFO",
      accountId: jack.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "phone",
      value: "+9998887776",
      category: "CONTACT_INFO",
      accountId: jack.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "twitter",
      value: "https://twitter.com/jack",
      category: "SOCIAL_LINK",
      accountId: jack.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "github",
      value: "https://github.com/jack",
      category: "PROFESSIONAL_LINK",
      accountId: jack.user.id,
    },
  });

  await prisma.trait.create({
    data: {
      key: "spotify",
      value: "https://open.spotify.com/user/jack",
      category: "OTHER",
      accountId: jack.user.id,
    },
  });

  const aliceCloseFriends = await prisma.connectionGroup.create({
    data: {
      name: "Close Friends",
      accountId: alice.user.id,
      traits: { connect: [{ id: aliceEmail.id }, { id: alicePhone.id }] },
    },
  });

  const bobColleagues = await prisma.connectionGroup.create({
    data: {
      name: "Colleagues",
      accountId: bob.user.id,
      traits: { connect: [{ id: bobTwitter.id }] },
    },
  });

  await prisma.connection.create({
    data: {
      accountId: alice.user.id,
      connectedAccountId: bob.user.id,
      status: "ACCEPTED",
      connectionGroups: { connect: [{ id: aliceCloseFriends.id }] },
    },
  });

  await prisma.connection.create({
    data: {
      accountId: bob.user.id,
      connectedAccountId: alice.user.id,
      status: "ACCEPTED",
      connectionGroups: { connect: [{ id: bobColleagues.id }] },
    },
  });

  console.log("Seeded 10 users, 2 connections, 50 traits, 2 connection groups");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
