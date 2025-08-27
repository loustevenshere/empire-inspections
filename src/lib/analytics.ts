export type AnalyticsEvent = {
  name: string;
  props?: Record<string, string | number | boolean>;
};

export function trackPageview() {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) return;
  // @ts-expect-error plausible injected in prod
  if (window.plausible) {
    // @ts-expect-error plausible injected in prod
    window.plausible("pageview");
  }
}

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) return;
  // @ts-expect-error plausible injected in prod
  if (window.plausible) {
    // @ts-expect-error plausible injected in prod
    window.plausible(event.name, { props: event.props ?? {} });
  }
}

