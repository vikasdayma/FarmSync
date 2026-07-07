import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { apiSuccess, apiNotFound, apiForbidden, apiServerError } from "@/lib/response"
import { getAuthUser, createNotification, createAuditLog } from "@/middleware/auth"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await getAuthUser(req)
  if ("error" in auth) return auth.error

  // only admin and govt officer
  if (!["SUPER_ADMIN", "GOVERNMENT_OFFICER"].includes(auth.user.role)) {
    return apiForbidden("Only admins can verify farms")
  }

  const { id } = await params

  try {
    const farm = await prisma.farm.findFirst({
      where: { id, deletedAt: null },
      include: { owner: { select: { id: true, firstName: true } } }
    })

    if (!farm) return apiNotFound("Farm not found")

    if (farm.isVerified) {
      return apiSuccess(farm, "Farm is already verified")
    }

    // verify the farm
    const updated = await prisma.farm.update({
      where: { id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
        verifiedBy: auth.user.sub,
      }
    })

    // notify the farmer
    await createNotification({
      userId: farm.owner.id,
      type: "SUCCESS",
      title: "Farm Verified! 🎉",
      body: `Your farm "${farm.name}" has been verified successfully!`
    })

    // audit log
    await createAuditLog({
      actorId: auth.user.sub,
      action: "UPDATE",
      entity: "Farm",
      entityId: id,
      req
    })

    return apiSuccess(updated, "Farm verified successfully")

  } catch (err) {
    return apiServerError(err)
  }
}
