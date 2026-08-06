import { NextResponse } from "next/server";
import { registerNewUser } from "@/features/auth/services/register.service";

export async function POST(request: Request) {
  try {

    const body = await request.json();

    const user = await registerNewUser({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Account created successfully. Please wait for Admin approval.",
        data: user 
      }, 
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Registration API Error:", error.message);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Internal server error" 
      }, 
      { status: 400 } 
    );
  }
}