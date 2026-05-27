    import pkg from "@prisma/client";

    const { PrismaClient } = pkg;

    const prisma=new PrismaClient({
        log: ["query","error"]
    });
    // console.log(Object.keys(prisma));


    export default prisma;
