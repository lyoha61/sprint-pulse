export async function requestMetricAiInsight(metricPayload, dashboardContext = []) {
	const response = await fetch('/api/ai/metric-insight', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			metric: metricPayload,
			context: dashboardContext,
		}),
	});

	if (!response.ok) {
		throw new Error('Failed to fetch AI insight');
	}

	const data = await response.json();

	return data.insight;
}