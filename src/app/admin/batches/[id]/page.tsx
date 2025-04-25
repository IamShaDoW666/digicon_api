/* eslint-disable */
import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/db";
import Image from "next/image";
import { BatchCard } from "./batchCard";
const batchesList = async ({ params }: { params: Promise<{ id: string }> }) => {
  const batch = await prisma.batch.findFirst({
    where: {
      id: (await params).id,
    },
    include: {
      media: true,
      createdBy: true,
    },
  });

  return (
    <>
      <SiteHeader title={batch?.reference!} />
      <div className="flex flex-1 flex-col mx-6">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <BatchCard reference={batch?.reference!} id={batch?.id!} />
            {batch?.media.length! > 0 && (
              <h2 className="font-semibold">Media</h2>
            )}
            {batch?.media.length! > 0 && (
              <div className="grid grid-cols-4 gap-8">
                {batch?.media.map((media) => {
                  return (
                    <div
                      key={media.id}
                      className="flex flex-col gap-2 rounded-md p-2 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 "
                    >
                      <a
                        href={media.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        <img
                          src={media.url}
                          alt={media.title ?? media.id}
                          width={500}
                          height={500}
                        />
                        {/* <Image
                        src={media.url}
                        alt={media.title ?? media.id}
                        width={500}
                        height={500}
                      /> */}
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default batchesList;
