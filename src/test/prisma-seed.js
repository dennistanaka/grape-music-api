const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const newUser = await prisma.user.create({
    data: {
      name: 'John',
      email: 'john@example.com',
      posts: {
        create: {
          title: 'Hello World',
          content: 'Content for Hello World post.'
        }
      }
    }
  })
  console.log('Created new user: ', newUser)

  const allUsers = await prisma.user.findMany({
    include: { posts: true },
  })
  console.log('All users: ')
  console.dir(allUsers, { depth: null })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
