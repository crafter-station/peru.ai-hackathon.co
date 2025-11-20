import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq } from "drizzle-orm";

export default async function ProfileRedirectPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  
  const participantNumber = parseInt(number, 10);
  
  if (isNaN(participantNumber)) {
    redirect("/");
    return null;
  }

  const participant = await db?.query.participants.findFirst({
    where: eq(participants.participantNumber, participantNumber),
  });

  if (!participant) {
    redirect("/");
    return null;
  }

  redirect(`/badge/${participant.id}`);
  return null;
}

