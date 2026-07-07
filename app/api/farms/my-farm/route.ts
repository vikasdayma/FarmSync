import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { apiSuccess, apiNotFound, apiServerError } from "@/lib/response"
import { getAuthUser } from "@/middleware/auth"

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req)
  if ("error" in auth) return auth.error

  try {
    const farm = await prisma.farm.findFirst({
      where: {
        ownerId: auth.user.sub,
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        status: true,
        // ✅ Add all these fields
        registrationNo: true,
        areaHectares: true,
        city: true,
        state: true,
        soilType: true,
        irrigationType: true,
        isVerified: true,
        createdAt: true,
        // ✅ Owner details
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        // ✅ Counts
        _count: {
          select: {
            cropCycles: true,
            soilReports: true,
          }
        }
      }
    })

    if (!farm) return apiNotFound("No farm found")
    return apiSuccess(farm, "Farm found")

  } catch (err) {
    console.log('my-farm error:', err)
    return apiServerError(err)
  }
}