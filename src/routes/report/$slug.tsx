import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Source site served reports at /report/:slug. Keep those URLs working.
 */
export const Route = createFileRoute("/report/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/research/$slug",
      params: { slug: params.slug },
    });
  },
});
