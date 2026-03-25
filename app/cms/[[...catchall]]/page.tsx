"use client";

// @ts-ignore
import { FirebaseCMSApp } from "firecms";
import { buildCollection } from "@firecms/core";
import { app } from "@/lib/firebase";

export default function CMSPage() {
    const teamMembersCollection = buildCollection({
        id: "team",
        path: "team",
        name: "Team Members",
        singularName: "Team Member",
        properties: {
            name: {
                name: "Name",
                dataType: "string",
                validation: { required: true }
            },
            role: {
                name: "Designation/Role",
                dataType: "string",
                validation: { required: true }
            },
            image: {
                name: "Photo URL",
                description: "Paste an explicit absolute URL or use storage",
                dataType: "string",
                validation: { required: true }
            },
            order: {
                name: "Display Order",
                dataType: "number",
                description: "Lower numbers appear first"
            }
        }
    });

    return (
        <FirebaseCMSApp
            name="India-ELA Admin"
            projectId="energy-law-association-india"
            firebaseConfig={app.options as any}
            basePath="/cms"
            collections={[teamMembersCollection]}
        />
    );
}
