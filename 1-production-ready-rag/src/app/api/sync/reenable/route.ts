import { userWithToken } from "@/app/actions/auth";
import { createActivity, getSyncTriggerByUserIdAndSource, getUser } from "@/db/queries";

interface ReenablePayload {
	integration: string,
}

export async function POST(req: Request) {
	const session = await userWithToken();

	if (!session || !session.user) {
		return Response.json("Unauthorized!", { status: 401 });
	}

	try {
		const reenable: ReenablePayload = await req.json();
		const trigger = await getSyncTriggerByUserIdAndSource({ id: session.user.email, source: reenable.integration });
		const syncRequest = await fetch(`https://sync.useparagon.com/api/syncs/${trigger[0].syncId}/reenable`, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${session.paragonUserToken}`,
				"Content-Type": "application/json",
			},
		});
		const syncResponse = await syncRequest.json();
		console.log(syncResponse);
		if (!syncRequest.ok) {
			throw new Error("Sync request failed: " + syncRequest.status);
		}
		const activity = await createActivity({
			event: "sync_reenabled",
			syncId: syncResponse.id,
			source: reenable.integration,
			objectType: "File Storage",
			receivedAt: new Date(),
			data: JSON.stringify(syncResponse),
			userId: session.user.email,
		});
		return Response.json({ activity: activity });
	} catch (err) {
		console.error("unable to sync for user: ", session.user.email, err);
		return Response.json("Unable to sync", { status: 500 });
	}
}
