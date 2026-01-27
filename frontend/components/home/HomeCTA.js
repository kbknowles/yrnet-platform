// filepath: frontend/components/home/HomeCTA.js

export default function HomeCTA() {
  return (
    <section className="bg-ahsra-blue text-white py-16 text-center">
      <h2 className="text-2xl font-bold">Ready to Ride?</h2>
      <p className="mt-4">Learn how to compete with AHSRA.</p>
      <a
        href="/about"
        className="inline-block mt-6 bg-white text-ahsra-blue px-6 py-3 rounded font-semibold"
      >
        Learn More
      </a>
    </section>
  );
}
