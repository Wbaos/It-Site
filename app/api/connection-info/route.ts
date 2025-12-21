import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('https://ipapi.co/json/', {
            headers: {
                'User-Agent': 'CallTechCare-SpeedTest/1.0'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from ipapi.co');
        }

        const data = await response.json();

        return NextResponse.json({
            isp: data.org || 'Unknown ISP',
            city: data.city || 'Unknown',
            country: data.country_name || 'Unknown',
            ip: data.ip || 'Unknown'
        });
    } catch (error) {
        console.error('Connection info error:', error);
        return NextResponse.json({
            isp: 'Unknown ISP',
            city: 'Unknown',
            country: 'Unknown',
            ip: 'Unknown'
        }, { status: 500 });
    }
}
