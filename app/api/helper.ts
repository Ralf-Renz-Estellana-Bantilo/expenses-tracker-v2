import { JWT, getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export const assertCheckSessionData = async (
  request: NextRequest,
  callback: (session?: JWT | null) => Promise<NextResponse<any>>
): Promise<NextResponse<any>> => {
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (session) {
    return await callback(session)
  } else {
    return NextResponse.json(
      {
        message: "Not signed-in",
      },
      { status: 401, statusText: "Unauthorized Access" }
    )
  }
}
