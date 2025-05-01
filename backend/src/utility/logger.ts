import { User } from "../generated/prisma";
import prisma from "../prisma";

async function logLoginEvent (user: User)  {
    console.log(`[LOGIN] User '${user.username}' ID: ${user.id || user.githubId} logged in at ${new Date().toLocaleString()}`);
    await prisma.loginLog.create({data:{userId:user.id}});
};

export {logLoginEvent};
  