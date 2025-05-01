import { User } from "../generated/prisma";
import prisma from "../prisma";

async function logLoginEvent (user: User,status: boolean, ipAddress: string){
    console.log(`[LOGIN] User '${user.username}'
         ID: ${user.id || user.githubId}
          logged in at ${new Date().toLocaleString()}
           status: ${status}
           IP Address: ${ipAddress}`
    );    
   
    await prisma.loginLog.create({data:{userId:user.id,status,ipAddress:ipAddress}});
};

export {logLoginEvent};
  