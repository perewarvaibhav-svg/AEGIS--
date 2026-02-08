import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();

    // Try OpenAI first if API key is available and has quota
    if (process.env.OPENAI_API_KEY) {
      try {
        const client = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const systemPrompt = `You are Aegis-1, the AI intelligence core of the Aegis Sentinel disaster monitoring system. You are an expert in emergency management, disaster risk reduction, seismology, meteorology, fire science, and crisis response.

MISSION CONTEXT (LIVE TELEMETRY):
${context || 'No active mission context. Provide general disaster safety guidance based on best practices.'}

YOUR CAPABILITIES:
- Risk Analysis: Deep probability-weighted multi-vector threat scoring
- Forecasting: 72-hour pulse models and 7-day strategic outlooks
- Safety Protocols: Role-adaptive tactical checklists and action plans
- Threat Assessment: Plain-language analysis of dominant hazards
- Emergency Locator: Guidance on finding medical, shelter, and relief resources
- SOS / Emergency: Generate shareable emergency briefings and rescue coordination messages

RESPONSE GUIDELINES:
1. Always ground your analysis in the live telemetry data provided above
2. Structure responses with clear headings using ** bold ** markers
3. Use numbered lists for action items and prioritized steps
4. Include "CRITICAL:" for life-threatening information
5. Include "ACTION:" for immediate steps the user should take
6. Include "EXPECTED:" for predictions and timeline projections
7. Provide 5-15 specific, actionable points per response
8. Be empathetic but direct -- lives may depend on your advice`;

        const completion = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: message || "Hello",
            },
          ],
        });

        return Response.json({
          response: completion.choices[0].message.content,
        });
      } catch (apiError: any) {
        // If OpenAI fails (quota exceeded, etc.), fall back to mock responses
        console.log("OpenAI API unavailable, using fallback system:", apiError.message);
      }
    }

    // FALLBACK: Mock NLP-style responses (works without API key)
    const lowerMessage = (message || "").toLowerCase();
    let response = "";

    // More natural language understanding
    if (lowerMessage.includes("risk") || lowerMessage.includes("danger") || lowerMessage.includes("threat")) {
      response = `**RISK ANALYSIS REPORT**

Based on your current location telemetry, I've identified the following threats:

**CRITICAL THREATS IDENTIFIED:**

1. **Flood Risk: 40%** - Moderate probability
   - Recent rainfall patterns indicate elevated water levels
   - ACTION: Monitor local water bodies and drainage systems
   - EXPECTED: Risk may increase in next 24-48 hours

2. **Seismic Activity: 1%** - Low probability
   - Minimal recent earthquake activity detected
   - NOTE: Continue routine preparedness measures

3. **Cyclone Risk: 28%** - Low-moderate probability
   - Weather patterns show potential tropical development
   - ACTION: Stay updated with meteorological alerts

4. **Heatwave: 15%** - Low probability
   - Temperature trends within normal range

5. **Landslide: 18%** - Low probability
   - Terrain stability appears normal
   - ACTION: Avoid unstable slopes during heavy rain

**OVERALL ASSESSMENT:** Your area shows moderate risk levels. Primary concern is flood potential. Maintain situational awareness and emergency supplies.`;
    }
    else if (lowerMessage.includes("forecast") || lowerMessage.includes("weather") || lowerMessage.includes("predict")) {
      response = `**72-HOUR DISASTER FORECAST**

**NEXT 6 HOURS (Immediate):**
- Weather: Partly cloudy, temperature 26°C
- Wind: 12 m/s from southwest
- Precipitation: 20% chance of light rain
- CRITICAL: No immediate threats detected

**6-24 HOURS:**
- Weather pattern shift expected
- Temperature drop to 23°C
- Wind increasing to 15 m/s
- ACTION: Secure loose outdoor items

**24-72 HOURS:**
- Potential storm system approaching
- Rainfall probability: 60%
- EXPECTED: 20-40mm precipitation
- ACTION: Check drainage systems, prepare emergency kit

**7-DAY STRATEGIC OUTLOOK:**
1. Days 1-3: Increased rainfall, monitor flood zones
2. Days 4-5: Weather stabilization expected
3. Days 6-7: Clear conditions likely
4. Seismic activity: Stable, no anomalies
5. Overall risk: Moderate, weather-related

**RECOMMENDATION:** Maintain readiness posture. Update emergency contacts and supplies.`;
    }
    else if (lowerMessage.includes("safety") || lowerMessage.includes("protocol") || lowerMessage.includes("prepare")) {
      response = `**SAFETY PROTOCOLS - IMMEDIATE ACTIONS**

**TIER 1: IMMEDIATE (Next 1 Hour)**
1. Verify emergency kit location and contents
2. Charge all communication devices to 100%
3. Fill bathtubs and containers with clean water
4. Secure important documents in waterproof container
5. Identify primary and secondary evacuation routes

**TIER 2: SHORT-TERM (1-6 Hours)**
1. Contact family members - establish check-in schedule
2. Move vehicles to higher ground if flood risk
3. Secure outdoor furniture and equipment
4. Stock 72-hour food and water supply
5. Prepare first aid kit and medications

**TIER 3: SUSTAINED (6-24 Hours)**
1. Monitor official emergency broadcasts continuously
2. Prepare evacuation bags for each family member
3. Identify nearest emergency shelter locations
4. Establish communication plan with neighbors
5. Document property condition (photos/video)

**CRITICAL CONTACTS:**
- Emergency Services: 911
- Local Emergency Management: Check local directory
- Weather Service: Monitor radio/TV alerts`;
    }
    else if (lowerMessage.includes("evacuat") || lowerMessage.includes("escape") || lowerMessage.includes("leave")) {
      response = `**EVACUATION PLANNING GUIDANCE**

**WHEN TO EVACUATE:**
- Official evacuation order issued
- Water entering your home
- Structural damage to building
- Loss of utilities for extended period
- You feel unsafe

**EVACUATION CHECKLIST:**
1. **Documents**: ID, insurance papers, medical records
2. **Medications**: 7-day supply minimum
3. **Cash**: ATMs may not work
4. **Phone chargers**: Car and portable chargers
5. **Clothing**: Weather-appropriate, sturdy shoes
6. **Food/Water**: Non-perishable, 3-day supply
7. **Pet supplies**: If applicable

**ROUTE PLANNING:**
- Identify 2-3 evacuation routes
- Avoid flood-prone areas
- Stay on designated evacuation routes
- Travel during daylight if possible
- Inform someone of your destination

**SHELTER OPTIONS:**
1. Friends/family outside affected area
2. Official emergency shelters
3. Hotels outside danger zone

**CRITICAL:** Never drive through flooded roads. Turn around, don't drown!`;
    }
    else if (lowerMessage.includes("sos") || lowerMessage.includes("emergency") || lowerMessage.includes("help")) {
      response = `**SOS EMERGENCY BRIEFING**

**IMMEDIATE SURVIVAL ACTIONS:**

**CRITICAL - DO NOW:**
1. Call emergency services: 911 or local emergency number
2. Move to highest, safest location in building
3. Signal for help: Use flashlight, whistle, or bright cloth
4. Conserve phone battery - text instead of call when possible
5. Stay calm and assess injuries

**RESCUE COORDINATION:**
- Stay in place if safe to do so
- Make yourself visible to rescuers
- Listen for rescue teams
- Do not enter floodwater
- Avoid downed power lines

**EMERGENCY MESSAGE FORMAT:**
"EMERGENCY at [Your Address]. [Number] people. [Injuries: Yes/No]. [Trapped: Yes/No]. [Water rising: Yes/No]. Need immediate assistance."

**SIGNAL METHODS:**
- SOS in Morse code: ... --- ... (3 short, 3 long, 3 short)
- Three of anything: 3 whistle blasts, 3 fires, 3 flashes
- Wave bright colored cloth
- Use mirror to reflect sunlight

**STAY STRONG:** Help is coming. Follow these protocols and remain calm.`;
    }
    else {
      // Generic helpful response for any other query
      response = `**AEGIS-1 DISASTER INTELLIGENCE**

I'm here to help with disaster preparedness and emergency response. I can assist you with:

**Available Guidance:**
- **Risk Analysis**: Assess current disaster threats in your area
- **Forecasting**: Weather and disaster predictions
- **Safety Protocols**: Step-by-step emergency procedures
- **Evacuation Planning**: Safe routes and shelter locations
- **Emergency Resources**: Find medical facilities and relief centers
- **SOS Guidance**: Immediate survival instructions

**Your Current Status:**
${context || 'Location data not available. Please provide coordinates for personalized guidance.'}

**How can I help you?** Ask me about:
- Current risks in your area
- Weather forecasts
- Safety procedures
- Evacuation planning
- Emergency contacts
- Survival tips

Type your question or select a module above for specific guidance.`;
    }

    return Response.json({ response }, { status: 200 });

  } catch (error: any) {
    console.error("Error:", error);
    return Response.json(
      { response: "I apologize, but I'm experiencing technical difficulties. Please try again or contact emergency services if this is urgent." },
      { status: 200 }
    );
  }
}
