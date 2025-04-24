import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/db";
import UserProfile from "./components/user-profile";
const userView = async ({ params }: { params: Promise<{ id: string }> }) => {
  const user = await prisma.user.findFirst({
    where: {
      id: (await params).id,
    },
    include: {
      uploadedMedia: true,
      createdBatches: true,
    },
  });
  if (!user) {
    return <div>User not found</div>;
  }
  return (
    <>
      <SiteHeader title={user?.name ?? user?.email} />
      <div className="flex flex-1 flex-col mx-6">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <UserProfile
              name={user.name ?? ""}
              id={user.id}
              email={user.email}
              phone={user.phone ?? ""}
              profile={user.profile!}
              role={user.role}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default userView;
