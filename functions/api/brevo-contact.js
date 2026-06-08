export async function onRequestPost({ request, env }) {
  const apiKey = env.BREVO_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Brevo API key is not configured.' }), { 
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
  const zipCode = body.zipCode || calculatorState.zip || '';
  const projectType = body.projectType || estimatePayload?.projectType || 'Home Repair Estimate';
  const estimatedCost = Number(body.estimatedCost || estimate.max || 0);

  const contactPayload = {
    email,
    updateEnabled: true,
    attributes: {
      FIRSTNAME: firstName,
      SMS: body.phone || undefined,
      ZIP_CODE: zipCode,
      PROJECT_TYPE: projectType,
      ESTIMATED_COST: estimatedCost
    }
  };

  const contactResult = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json'
    },
    body: JSON.stringify(contactPayload)
  });

  if (!contactResult.ok && contactResult.status !== 400) {
    return new Response(JSON.stringify({ error: 'Brevo contact sync failed.' }), { 
      status: contactResult.status,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (env.BREVO_TEMPLATE_ID) {
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        to: [{ email, name: firstName }],
        templateId: Number(env.BREVO_TEMPLATE_ID),
        params: {
          firstName,
          projectType,
          zipCode,
          estimatedCost,
          estimateRange: estimate.min && estimate.max ? `$${estimate.min} - $${estimate.max}` : '',
          calculatorState
        }
      })
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
