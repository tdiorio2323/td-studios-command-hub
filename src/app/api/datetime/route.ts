import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const currentDateTime = new Date()

    const response = {
      success: true,
      data: {
        date: currentDateTime.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        time: currentDateTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        }),
        iso: currentDateTime.toISOString(),
        timestamp: currentDateTime.getTime(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        formatted: `${currentDateTime.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })} at ${currentDateTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        })}`
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to get current date/time'
    }, { status: 500 })
  }
}
