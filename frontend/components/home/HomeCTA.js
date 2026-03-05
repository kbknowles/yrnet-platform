// filepath: frontend/components/home/HomeCTA.js

export default function HomeCTA() {
  return (
        <div className="py-2">

    <section className="bg-accent text-white py-12 text-center">
      <h2 className="text-2xl font-bold">Ready to Ride?</h2>
      <p className="mt-4">Learn how to compete with AHSRA.</p>
      <a
        href="/learn-more"
        className="inline-block mt-6 bg-white text-secondary px-6 py-3 rounded font-semibold"
      >
        Learn More
      </a>
    </section>
</div>
  );
}