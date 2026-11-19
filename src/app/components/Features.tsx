const features = [
  {
    title: "Community Events",
    description:
      "Discover local gatherings and find welcoming ways to get involved.",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18M8 14h3" />
      </>
    ),
  },
  {
    title: "Care & Support",
    description:
      "Share kindness, lend a hand, and help neighbors feel supported.",
    icon: (
      <path d="M20.8 8.7c0 5.2-8.8 10.1-8.8 10.1S3.2 13.9 3.2 8.7A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.3Z" />
    ),
  },
  {
    title: "Make an Impact",
    description:
      "Turn small acts of service into positive change close to home.",
    icon: (
      <>
        <path d="M20 4c-9 0-15 4-15 11a5 5 0 0 0 5 5c7 0 11-7 10-16Z" />
        <path d="M4 21c3-5 7-8 12-11" />
      </>
    ),
  },
  {
    title: "Stronger Together",
    description:
      "Meet caring neighbors and build a community where everyone belongs.",
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
      </>
    ),
  },
];

export default function Features() {
  return (
    <section
      aria-labelledby="features-heading"
      className="bg-white px-6 py-16 transition-colors dark:bg-slate-950 sm:px-8 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300 sm:text-sm">
            Find your way to make a difference
          </p>
          <h2
            id="features-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl"
          >
            Our Features
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
            Everything you need to connect with your neighbors and care for
            your community.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-2xl border border-emerald-100 bg-[#f8fbf8] p-6 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-lg hover:shadow-emerald-950/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-800 dark:hover:bg-slate-800"
            >
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-800 transition-colors group-hover:bg-emerald-700 group-hover:text-white dark:bg-emerald-950 dark:text-emerald-300">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-6"
                >
                  {feature.icon}
                </svg>
              </span>
              <h3 className="mt-5 text-base font-semibold text-slate-900 dark:text-slate-100">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
