export async function onRequestPost({ request, env }) {
  const webhookUrl = env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    return new Response(JSON.stringify({ error: 'Google Sheets webhook is not configured.' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body.' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const email = String(body.email || '').trim();
  const firstName = String(body.firstName || body.name || '').trim();

  if (!email || !firstName) {
    return new Response(JSON.stringify({ error: 'Name and email are required.' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const estimatePayload = safeJson(body.estimatePayload);
  const calculatorState = estimatePayload?.state || {};
  const estimate = estimatePayload?.estimate || {};
  
  const payload = {
    email: email,
    firstName: firstName,
    phone: body.phone || '',
    zipCode: body.zipCode || calculatorState.zip || '',
    projectType: body.projectType || estimatePayload?.projectType || 'Home Repair Estimate',
    estimatedCost: Number(body.estimatedCost || estimate.max || 0)
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    return new Response(JSON.stringify({ error: 'Google Sheets sync failed.' }), { 
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ ok: true }), { 
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

function safeJson(value) {
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    return null;
  }
}
