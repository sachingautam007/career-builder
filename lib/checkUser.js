import { currentuser } from "@clerk/nextjs/server";
export const CheckUser = async () => {
  const user = await currentuser();

  if(!user){
    return null;
  }
  try {
    const loggedUser = await db.user.findUnique({
      where: {
        email: user?.email,
  }
    });
    if (!loggedUser) {
    return loggedUser;
    }
    const name = user.firstName + " " + user.lastName;
    
    const updatedUser = await db.user.update({
      where: {
        email: user?.email,
      },
      data: {
        name: name,
      },
    });
    return updatedUser;
  } catch (error) {
    console.error("Error checking user:", error);
    return null;
  }
};