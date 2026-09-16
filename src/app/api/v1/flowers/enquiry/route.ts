import { NextRequest, NextResponse } from "next/server";
import { flowerRepository } from "@/repositories/flowerRepository";
import { notificationService } from "@/services/notificationService";
import { getSessionUser } from "@/lib/auth/jwt";
import { USER_ROLES } from "@/config/constants";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (session && (session.role === USER_ROLES.ADMIN || session.role === USER_ROLES.FARM_MANAGER)) {
      return NextResponse.json(
        {
          success: false,
          error: "Administrators cannot submit floral requests from the storefront. Please use the Admin Portal.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      contactName,
      phone,
      email,
      occasion,
      preferredDate,
      budgetRange,
      flowerPreferences,
      colorPalette,
      messageNote,
      additionalRequirements,
      referenceImages = [],
    } = body;

    if (!contactName || !phone || !preferredDate) {
      return NextResponse.json(
        { success: false, error: "Contact name, phone, and preferred date are required." },
        { status: 400 }
      );
    }

    const enquiry = await flowerRepository.createEnquiry({
      customer: session?.userId as any,
      contactName,
      phone,
      email,
      occasion,
      preferredDate: new Date(preferredDate),
      budgetRange,
      flowerPreferences,
      colorPalette,
      messageNote,
      additionalRequirements,
      referenceImages,
    });

    notificationService.sendFlowerEnquiryAlert(enquiry).catch(console.error);

    return NextResponse.json({
      success: true,
      data: {
        enquiryNumber: enquiry.enquiryNumber,
        message: "Your flower request has been received! Our florists will contact you shortly.",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const enquiries = await flowerRepository.listEnquiries();
    return NextResponse.json({ success: true, data: enquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
